//glavna konfiguracija aplikacije
//ovde se definišu svi globalni servisi i rute koje će aplikacija koristiti
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthGuard } from './auth/authGuard.service';

export const appConfig: ApplicationConfig = {
  providers: [
    //zadaju se rute za aplikaciju
    //provideRouter se koristi za konfiguraciju ruter-a u Angular aplikaciji i povlači rute iz datoteke app.routes.ts
    provideRouter(routes),
    //provideHttpClient se koristi za konfiguraciju HTTP klijenta u Angular aplikaciji
    //omogućava slanje HTTP zahteva ka serveru i vraća Observable na koji se pretplaćujemo u komponentama
    provideHttpClient(),
    //AuthGuard se koristi za zaštitu ruta u Angular aplikaciji
    //proverava da li je korisnik ulogovan pre nego što mu dozvoli pristup određenim stranicama
    AuthGuard ,
  ]
};