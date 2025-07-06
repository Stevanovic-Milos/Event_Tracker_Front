import { Routes } from '@angular/router';
import { Home } from './home/home';
import { SignIn } from './sign-in/sign-in';
import { SignUp } from './sign-up/sign-up';

//ovde predefinisemo adresu rute na kraju naseg url-a i povezujemo komponentu sa rutom
export const routes: Routes = [
  //postavljamo home da bude kad akorisnik tek udje i nema rutu
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'sign-in', component: SignIn },
  { path: 'sign-up', component: SignUp }
];