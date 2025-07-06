import { Component, OnInit } from '@angular/core';
import { Event } from '../Models/models';
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';

@Component({
  selector: 'app-home',
  //CommonModule nam omogucava da koristimo osnovne angularove selektore kao sto je ngIf
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {

  //Inicijalizujemo event na nas model Event koji ima deklarisane atribute
  events: Event[] = [];
  loading = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  //standardna angularova kontrola sve sto je ove aktivira se odmah po ucitavanju ove komponente 
  ngOnInit(): void {
    this.loadEvents();
  }


  //Funkcija koja ucitava eventove poziva apiService koji smo deklarisali u konstruktoru i subskrajbuje se na njega 
  //kupi podatke data je odgovor servera ta data se dodeljuje nasim eventima ovde i loading se stavlja na false
  // u slucaju greske  ide an error deo 
  loadEvents(): void {
    this.apiService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load events';
        this.loading = false;
        console.error(err);
      }
    });
  }
}