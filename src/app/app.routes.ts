import { Routes } from '@angular/router';
import { Home } from './home/home';
import { SignIn } from './sign-in/sign-in';
import { SignUp } from './sign-up/sign-up';
import { AuthGuard } from './auth/authGuard.service';

//ovde predefinisemo adresu rute na kraju naseg url-a i povezujemo komponentu sa rutom
export const routes: Routes = [
  //postavljamo home da bude kad akorisnik tek udje i nema rutu
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  //na home ruti je komponenta Home koja je zaštićena AuthGuard-om
  //AuthGuard je servis koji proverava da li je korisnik ulogovan pre nego što mu dozvoli pristup određenim stranicama dakle ako korisnik nije ulogovaan ne moze da pristupi home ruti
  { path: 'home', component: Home, canActivate: [AuthGuard] },
  { path: 'sign-in', component: SignIn },
  { path: 'sign-up', component: SignUp }
];