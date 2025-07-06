//ova komponenta je kreirana automatski prilikom kreiranja Angular aplikacije
// ona je glavni kontejner za sve ostale komponente i sadrži rute i druge konfiguracije
//u nju se ubacuju sve komponente koje su potrebne za aplikaciju jer su one ubacene u app.config.ts i app 
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));