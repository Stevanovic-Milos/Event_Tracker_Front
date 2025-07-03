import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  //ovo je glavna konfiguracija gde dajemo kao provajdere httpclient koji omogucava rad sa http zahtevima 
  //bez toga ne bi mogli da radimo post get i druge metode a Router nam omogucava da menjamo rute prozora
  //Rute romogucava takodje d apostavimo home d abude pocetni prozor
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
};