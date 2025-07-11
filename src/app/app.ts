import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Sidebar } from "./sidebar/sidebar";
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Sidebar, CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  //ubacujemo router d abi moglui da proveravamo na kojoj smo ruti 
  constructor(private router: Router) { }
  //ako je router na nekoj od zadatih ruta vraca se true
  get isAuthPage(): boolean {
    return this.router.url === '/sign-in' ||
      this.router.url === '/sign-up' ||
      //ovo je bitno postaviti da se ni na sekund prilikom redirekcije nebi ucitavao sidebar i time povlacio svoje init metode
      this.router.url === '/';
  }
}