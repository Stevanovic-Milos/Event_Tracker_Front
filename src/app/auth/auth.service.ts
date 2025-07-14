//ovaj servis je zadužen za autentifikaciju korisnika on je jedini servis koji nema headr token jer pristupa na jeidne dve nezaštićene rute
//on je zadužen za kreiranje novog korisnika i logovanje postojećeg korisnika
//on koristi HttpClient za slanje HTTP zahteva ka serveru i vraća Observable na koj se pretplaćujemo u komponentama
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../Environments/environment';
import { User } from '../Models/models';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';

//injectable decorator se koristi da bi Angular znao da je ova klasa servis koji može biti injektovan u druge komponente ili servise
//providedIn: 'root' znači da će ovaj servis biti dostupan u celoj aplikaciji, bez potrebe da ga ručno dodajemo u providers niz u modulu
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // Definišemo URL API-ja koji će se koristiti za autentifikaciju
    // Ovaj URL se uzima iz environment fajla, što omogućava da se lako menja u zavisnosti od okruženja (razvojno, produkcijsko itd.)
    private apiUrl = environment.apiUrl;

    // HttpClient se koristi za slanje HTTP zahteva ka serveru
    // Ovaj servis se injektuje u konstruktoru klase AuthService
    constructor(private http: HttpClient, private cookieService: CookieService, private toastr: ToastrService) { }

    // Metode za  sign in korisnika, sa dva parametra: username i password
    // Ove metode šalju POST zahteve ka serveru sa korisničkim imenom i lozinkom
    // Vraćaju Observable koji se može pretplatiti u komponentama da bi se pratila uspešnost operacije a response servera je jwt token koji se koristi za autentifikaciju u budućim zahtevima
    signIn(username: string, password: string): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/api/auth/signin`, {
            username,
            password
        });
    }

    // Metoda za registraciju novog korisnika
    // Ova metoda takođe šalje POST zahtev ka serveru sa korisničkim imenom i lozinkom
    // Vraća Observable koji se može pretplatiti u komponentama da bi se pratila uspešnost operacije za razliku od signIn metode, ova metoda ne vraća token jer se koristi za kreiranje novog korisnika
    signUp(username: string, password: string, firstname: string, lastname: string, email: string): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/api/auth/signup`, {
            username,
            password,
            firstname,
            lastname,
            email
        });
    }

    //funkcija koja radi logout korisnika na principu da ako postoji token brisemo token i radimo reload 
    //interceptor koji smo postavili preko auth garda ce nas automatski vratiti na sign-in stranicu cim ostanemo bez tokena
    logout() {
        if (!this.cookieService.get('auth_token')) {
            this.toastr.warning("Morate biti ulogovani da biste se odjavili");
            return;
        }
        this.cookieService.delete('auth_token');
        window.location.reload();
    }
    isLogged(): boolean {
        return !!this.cookieService.get('auth_token');
    }

}