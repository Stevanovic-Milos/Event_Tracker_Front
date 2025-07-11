import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { User } from '../Models/models';
import { UserDataService } from '../Shared/userData.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class Sidebar implements OnInit {
  //korisnik moze biti i nedefinisan u slucaju ucitavnja bara bez ulogovanog korisnika sto ce biti dodato u kasnijim impplementacijama
  user: User | undefined

  constructor(private userDataService: UserDataService, private authService: AuthService) { }

  //na initu ucitavamo sve podatke o ulogovanom korisniku
  ngOnInit(): void {
    this.getUserDetails()
  }
  //inicijalno stanje bara je false
  isSideOpen = false;

  //jedan klik baca na false drugi na true
  toggleSideNav() {
    this.isSideOpen = !this.isSideOpen;
  }

  //funkcija koja uzima sve podatke o korisniku
  getUserDetails() {
    //pozivamo nas servise i nasem user objektu dodeljujemo user objekat koji nam vraca server
    this.userDataService.getUserDetails().subscribe({
      next: (response) => {
        this.user = response;
      },
      error: (error) => {
        alert("Došlo je do greške priliko dobijanja korisničkih podataka")
        console.log(error)
      }
    })
  }

  //funkcija za potvrdu logouta
  confirmLogout() {
    //ako je odgovor ok vraca true 
    if ( confirm("Da li ste sigurni da želite da se odjavite?")) {
      //servisni poziv koji brise auth token iz cooke storage
      this.authService.logout();
    }
  }
}