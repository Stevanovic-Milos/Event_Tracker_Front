//ovo je dataService koji se koristi za slanje HTTP zahteva ka serveru ovaj servis ce koristit svaki drugi servis u aplikaciji
//ovaj servis ce se koristiti da se preko njega salju HTTP zahtevi ka serveru jer ovaj servis uz svaki zahtev dodaje header sa tokenom za autentifikaciju
//tako da ne moramo svaki put da dodajemo header sa tokenom u svaki servis koji šalje HTTP zahteve
//on koristi HttpClient za slanje HTTP zahteva i CookieService za čitanje kolačića (cookies) koji sadrže token za autentifikaciju
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

// Injectable decorator se koristi da bi Angular znao da je ova klasa servis koji može biti injektovan u druge komponente ili servise
// providedIn: 'root' znači da će ovaj servis biti dostupan u celoj aplikaciji, bez potrebe da ga ručno dodajemo u providers niz u modulu
@Injectable({
    providedIn: 'root'
})
export class DataService {

    //ovaj konstruktor se koristi za injektovanje HttpClient, CookieService i Router servisa
    //HttpClient se koristi za slanje HTTP zahteva ka serveru
    //CookieService se koristi za čitanje kolačića (cookies) koji sadrže token za autentifikaciju
    //Router se koristi za navigaciju između stranica
    constructor(
        private http: HttpClient,
        private cookieService: CookieService,
        private router: Router
    ) { }

    // Ova metoda vraća HttpHeaders sa tokenom za autentifikaciju koji se čita iz kolačića
    // Ovaj token se koristi za autentifikaciju korisnika prilikom slanja HTTP zahteva
    // Ovaj token se dodaje u svaki HTTP zahtev koji se šalje ka serveru
    private getAuthHeaders(): HttpHeaders {
        // Čitamo token iz kolačića sa imenom 'auth_token'
        // Ako token ne postoji, vraćamo prazan HttpHeaders

        const token = this.cookieService.get('auth_token');
        // kreirani HttpHeaders salje u headerz da je tipa 'application/json' i dodaje Authorization header sa tokenom
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    // Ova metoda se koristi za obradu grešaka prilikom slanja HTTP zahteva
    private handleError(error: HttpErrorResponse) {
        // Ako dođe do greške sa statusom 401 (Unauthorized), korisnik će biti preusmeren na stranicu za prijavu
        if (error.status === 401) {
            this.router.navigate(['/sign-in']);
        }
        //ako dodje do bilo koje druge greške, radimo throwError da bi se greška obradila u komponenti koja je pozvala ovu metodu
        return throwError(() => error);
    }

    //nasa get metoda prima URL i vraća Observable sa tipom T
    //Tip T može biti bilo koji tip podataka koji očekujemo da dobijemo kao odgovor od servera
    //Ova metoda se koristi za slanje GET zahteva ka serveru sa nasim headerima za autentifikaciju
    //Ako dođe do greške, poziva se handleError metoda koja će obraditi grešku i preusmeriti korisnika na stranicu za prijavu ako je greška 401 (Unauthorized)
    get<T>(url: string): Observable<T> {
        // šaljemo GET zahtev ka serveru sa URL-om i našim headerima za autentifikaciju
        // koristimo catchError da obradimo grešku ako dođe do nje
        return this.http.get<T>(url, { headers: this.getAuthHeaders() })
        //pipe radi tako da se greška hvata i prosleđuje handleError metodi
    }

    //ova metoda se koristi za slanje POST zahteva ka serveru sa nasim headerima za autentifikaciju
    //Ova metoda prima URL i telo zahteva (body) i vraća Observable sa tipom T
    //Ako dođe do greške, poziva se handleError metoda koja će obraditi grešku i preusmeriti korisnika na stranicu za prijavu ako je greška 401 (Unauthorized)
    post<T>(url: string, body: any): Observable<T> {
        return this.http.post<T>(url, body, { headers: this.getAuthHeaders() })
            .pipe(catchError(this.handleError.bind(this)));
    }

    //ovo je nasa put metoda koja se koristi za slanje PUT zahteva ka serveru sa nasim headerima za autentifikaciju uglavnom se u praksi koristi za ažuriranje resursa medjutim u realnom poslovnom okruženju foks ce biti na get i post uvek.
    //Ova metoda prima URL i telo zahteva (body) i vraća Observable sa tipom T
    //Ako dođe do greške, poziva se handleError metoda koja će obraditi grešku i preusmeriti korisnika na stranicu za prijavu ako je greška 401 (Unauthorized)
    put<T>(url: string, body: any): Observable<T> {
        return this.http.put<T>(url, body, { headers: this.getAuthHeaders() })
            .pipe(catchError(this.handleError.bind(this)));
    }

    //ova metoda se koristi za slanje DELETE zahteva ka serveru sa nasim headerima za autentifikaciju
    //Ova metoda prima URL i vraća Observable sa tipom T
    //Ako dođe do greške, poziva se handleError metoda koja će obraditi grešku i preusmeriti korisnika na stranicu za prijavu ako je greška 401 (Unauthorized)
    delete<T>(url: string): Observable<T> {
        return this.http.delete<T>(url, {
            headers: this.getAuthHeaders()
        }).pipe(
            catchError(this.handleError.bind(this))
        );
    }

    //ova metoda se koristi za slanje PATCH zahteva ka serveru sa nasim headerima za autentifikaciju
    //Ova metoda prima URL i telo zahteva (body) i vraća Observable sa tipom T
    //Ako dođe do greške, poziva se handleError metoda koja će obraditi grešku i preusmeriti korisnika na stranicu za prijavu ako je greška 401 (Unauthorized)
    patch<T>(url: string, body: any): Observable<T> {
        return this.http.patch<T>(url, body, { headers: this.getAuthHeaders() })
            .pipe(catchError(this.handleError.bind(this)));
    }
}