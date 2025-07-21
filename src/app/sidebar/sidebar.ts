import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { User } from '../Models/models';
import { UserDataService } from '../Shared/userData.service';
import { AuthService } from '../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AdminGuard } from '../auth/adminGuard.service';

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

  constructor(private userDataService: UserDataService, private authService: AuthService, private toastr: ToastrService, private adminGuard: AdminGuard) { }

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
  closeSidebar() {
    this.isSideOpen = false;
  }

  //funkcija koja uzima sve podatke o korisniku
  getUserDetails() {
    //pozivamo nas servise i nasem user objektu dodeljujemo user objekat koji nam vraca server
    this.userDataService.getUserDetails().subscribe({
      next: (response) => {
        this.user = response;
      },
      error: (error) => {
        this.toastr.warning("Došlo je do greške priliko dobijanja korisničkih podataka")
        console.log(error)
      }
    })
  }

  //funkcija za potvrdu logouta
  confirmLogout() {
    //ako je odgovor ok vraca true 
    if (confirm("Da li ste sigurni da želite da se odjavite?")) {
      //servisni poziv koji brise auth token iz cooke storage
      this.authService.logout();
    }
  }
  //proveravamo da li je korisnik amdin da bi mu uopste dozvolili da vidi admin sekciju za dodavanje eventova
  //sekcija je svakako zasticena auth guardom i na beku je zasticena authorizacijom ali ovo je smao vizuelne prirode da je obican korisnik uopste ne vidi
  isAdmin() {
    if (this, this.user?.role == "ROLE_ADMIN") {
      return true;
    }
    else {
      return false;
    }
  }
}