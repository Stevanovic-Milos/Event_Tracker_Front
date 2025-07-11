import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss'
})
export class SignUp implements OnInit {

  // Ovo je konstruktor koji se koristi za injektovanje servisa i routera 
  constructor(
    private router: Router,
    private authService: AuthService,
    private cookieService: CookieService
  ) {
  }

  // ngOnInit je metoda koja se poziva kada se komponenta inicijalizuje
  // Ovdje proveravamo da li je korisnik već ulogovan i ako jeste, preusmeravamo ga na home stranicu
  ngOnInit() {
    this.redirectToEvent();
  }
  // Definišemo formu i njene kontrole koristeći FormGroup i FormControl
  // FormGroup se koristi za grupisanje više kontrola u jednu logičku celinu
  signUpForm = new FormGroup({
    username: new FormControl<string>('', [Validators.required]),
    firstname: new FormControl<string>('', [Validators.required]),
    lastname: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl<string>('', [Validators.required, this.confirmPasswordValidator.bind(this)])
  });

  // Ova metoda se koristi za validaciju polja confirmPassword
  confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password = this.signUpForm?.get('password')?.value;
    // Proveravamo da li je polje confirmPassword popunjeno to raidmo tkaos to u tom polju .bind(this) radimo kako bi ga prosledili kao control
    const confirmPassword = control.value;
    // Proveravamo da li su oba polja popunjena
    // Ako nisu, vraćamo null što znači da nema greške
    if (!password || !confirmPassword) {
      return null;
    }
    //uzimamo get metodu da bismo dobili vrednost polja confirmPassword i proveravamo da li je null bilo koje polje
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    // Proveravamo da li je forma validna pre nego što pošaljemo podatke
    // Ako forma nije validna, ne šaljemo podatke 
    if (this.signUpForm.valid) {
      const { username, password, firstname, lastname, email } = this.signUpForm.value;
      // Proveravamo da li su korisničko ime i lozinka uneti
      // Ako nisu, ne šaljemo podatke i vraćamo se iz funkcije
      // Ovo je važno da bismo sprečili slanje praznih podataka na server
      if (!username || !password || !firstname || !lastname || !email) {
        return;
      }
      //pozivamo servis za registraciju korisnika
      //AuthService se koristi za autentifikaciju korisnika, a CookieService za rad sa kolačićima (cookies)
      //Router se koristi za navigaciju između stranica
      this.authService.signUp(username, password, firstname, lastname, email).subscribe({
        //ako je uspešna registracija, postavljamo token u kolačić i preusmeravamo korisnika na home stranicu
        //u slučaju uspeha, ispisujemo poruku u konzoli i obaveštavamo korisnika
        next: (response) => {
          console.log('Registracija uspešna', response);
          if(response.success && response.token=='signed-up') {
            this.onSignUpSucess(username, password);
          }
          if(response.token =='username-exists') {
            alert('Korisničko ime već postoji. Molimo pokušajte sa drugim korisničkim imenom.');
          }
         if(response.token =='email-exists') {
            alert('Email već postoji. Molimo pokušajte sa drugim email-om.');
         }
        },
    
        //u slučaju greške, ispisujemo grešku u konzoli i obaveštavamo korisnika
        //ako je greška 400, to znači da korisničko ime već postoji
        error: (error) => {
            alert('Došlo je do neočekivane greške.');
            console.log('Greška prilikom registracije', error);
          }
        
      });

    }
  }
  // Navigira korisnika na stranicu za prijavu
  onSignInPage() {
    this.router.navigate(['/sign-in']);
  }

   onSignUpSucess(username: string, password: string) {
    this.authService.signIn(username, password).subscribe({
      next: (response) => {
        console.log('Prijava uspešna', response);
        // Ako je autentifikacija uspešna, dobijamo token koji ćemo sačuvati u kolačićima
        // Token ćemo koristiti za autentifikaciju u budućim zahtevima
        if (response.token) {
          this.cookieService.set('auth_token', response.token);
          this.router.navigate(['/event']);
        } else {
          console.error('Token nije pronađen u odgovoru');
        }
      },
      error: (error) => {
        console.error('Neuspelo logovanje', error);
        if (error.status === 401) {
          alert('Pogrešno korisničko ime ili lozinka. Molimo pokušajte ponovo.');
        }
      }
    });
  }

  // Proverava da li je korisnik već ulogovan i ako jeste, preusmerava ga na home stranicu
  // Ovo je korisno da se ne bi korisnik vraćao na registracionu stranicu
  redirectToEvent() {
    if (this.cookieService.get('auth_token')) {
      this.router.navigate(['/event']);
    }
  }
}