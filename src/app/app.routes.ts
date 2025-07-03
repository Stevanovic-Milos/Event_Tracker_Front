import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

//ovde predefinisemo adresu rute na kraju naseg url-a i povezujemo komponentu sa rutom
export const routes: Routes = [
  //postavljamo home da bude kad akorisnik tek udje i nema rutu
  { path: '', redirectTo: '/home', pathMatch: 'full' }, 
  { path: 'home', component: HomeComponent },
];