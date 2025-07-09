//ovo je authGuard servis koji se koristi za zaštitu ruta u Angular aplikaciji
//on proverava da li je korisnik ulogovan pre nego što mu dozvoli pristup određenim stranicama
//ako korisnik nije ulogovan, preusmerava ga na stranicu za prijavu (sign-in)
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

//Injectable decorator se koristi da bi Angular znao da je ova klasa servis koji može biti injektovan u druge komponente ili servise
//providedIn: 'root' znači da će ovaj servis biti dostupan u celoj aplikaciji, bez potrebe da ga ručno dodajemo u providers niz u modulu
@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    // Ovaj servis koristi CookieService za pristup kolačićima (cookies) i Router za navigaciju
    // CookieService se koristi za čitanje kolačića koji sadrže token za autentifikaciju
    // Router se koristi za preusmeravanje korisnika na stranicu za prijavu
    constructor(
        private cookieService: CookieService,
        private router: Router
    ) { }

    // canActivate metoda se koristi da bi se proverilo da li korisnik ima pristup određenoj ruti
    // Ova metoda se poziva pre nego što se ruta aktivira
    canActivate(): boolean {
        // Proveravamo da li postoji kolačić sa imenom 'auth_token'
        if (this.cookieService.get('auth_token')) {
            // Ako kolačić postoji, korisnik je ulogovan i dozvoljavamo pristup ruti
            return true;
        // Ako kolačić ne postoji, korisnik nije ulogovan i preusmeravamo ga na stranicu za prijavu
        } else {
            this.router.navigate(['/sign-in']);
            return false;
        }
    }
}