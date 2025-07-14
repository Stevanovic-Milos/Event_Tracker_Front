import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatButtonModule,
  ],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss'
})
export class SignIn implements OnInit {

  //ovo je konstruktor koji se koristi za injektovanje servisa i routera
  //AuthService se koristi za autentifikaciju korisnika, a CookieService za rad sa kolačićima (cookies)
  //Router se koristi za navigaciju između stranica
  constructor(
    private router: Router,
    private authService: AuthService,
    private cookieService: CookieService,
    private toastr: ToastrService
  ) {}

  //ngOnInit je metoda koja se poziva kada se komponenta inicijalizuje
  //ovde cemo proveriti da li je korisnik vec ulogovan i ako jeste, preusmeriti ga na home stranicu
  ngOnInit() {
    this.redirectToEvent();
  }

  //ovde definišemo formu i njene kontrole
  //koristimo FormGroup i podelemnete FormControl da bismo definisali formu
  signInForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  onSubmit() {
    //proveravamo da li je forma validna pre nego što pošaljemo podatke
    //ako forma nije validna, ne šaljemo podatke
    if (this.signInForm.valid) {
      const { username, password } = this.signInForm.value;
      
      if (username && password) {
        //pozivamo servis za autentifikaciju da se korisnik uloguje
        //ako je autentifikacija uspesna, dobijamo token koji cemo sacuvati u cookies
        this.authService.signIn(username, password).subscribe({
          next: (response: any) => {
            console.log('Registracija uspešna', response);           
            if (response.token) {
              //ako je autentifikacija uspesna, dobijamo token koji cemo sacuvati u cookies
              //token cemo koristiti za autentifikaciju u buducim zahtevima
              this.cookieService.set('auth_token', response.token);             
              this.router.navigate(['/event'])
            } else {
              console.error('Token nije pronađen u odgovoru');
            }
          },
          //ovo je greska koja se desava ako korisnik unese pogresne podatke
          //status 401 znaci da je korisnik uneo pogresne podatke
          error: (error) => {
            console.error('Neuspelo logovanje', error);
            if (error.status === 401) {
               this.toastr.error('Pogresno korisničko ime ili lozinka. Molimo pokušajte ponovo.');
            }
          }
        });
      }
    }
  }

  //ova funkcija proverava da li je korisnik vec ulogovan i ako jeste, preusmerava ga na home stranicu
  //ovo je korisno da se ne bi korisnik vracao na login stranicu
  redirectToEvent() {
    if(this.cookieService.get('auth_token')) {
      this.router.navigate(['/event']);
    }
  }

  //ova funkcija preusmerava korisnika na stranicu za registraciju
  onSignUpPage() {
    this.router.navigate(['/sign-up']);
  }
}