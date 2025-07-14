import { Routes } from '@angular/router';
import { SignIn } from './sign-in/sign-in';
import { SignUp } from './sign-up/sign-up';
import { AuthGuard } from './auth/authGuard.service';
import { EventDetail } from './event-detail/event-detail';
import { Events } from './event/event';
import { MyEvents } from './my-events/my-events';
import { CreateEvent } from './create-event/create-event';
import { AdminGuard } from './auth/adminGuard.service';
import { AdminCreatedEvents } from './admin-created-events/admin-created-events';

//ovde predefinisemo adresu rute na kraju naseg url-a i povezujemo komponentu sa rutom
export const routes: Routes = [
  //postavljamo home da bude kad akorisnik tek udje i nema rutu
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  //na home ruti je komponenta Home koja je zaštićena AuthGuard-om
  //AuthGuard je servis koji proverava da li je korisnik ulogovan pre nego što mu dozvoli pristup određenim stranicama dakle ako korisnik nije ulogovaan ne moze da pristupi home ruti
  { path: 'event', component: Events, canActivate: [AuthGuard] },
  //ova se razlikuje zato sto cemo prosledjivati parametar id kad god idmeo na ovu rutu sto je krucijalno za nasu logiku dobijanja bas jednog specificnog eventa
  { path: 'event/:id', component: EventDetail, canActivate: [AuthGuard] },
  { path: 'my-events', component: MyEvents, canActivate: [AuthGuard] },
  //sekcije gde postoji i adminguard dozvoljavaju pristup iskljucivo adminima 
  { path: 'create-event', component: CreateEvent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin-events', component: AdminCreatedEvents, canActivate: [AuthGuard, AdminGuard] },
  { path: 'sign-in', component: SignIn },
  { path: 'sign-up', component: SignUp }
];