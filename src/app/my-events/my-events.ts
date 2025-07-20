import { Component } from '@angular/core';
import { MyEventsService } from './my-events.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Event } from '../Models/models';
import { Loading } from '../loading/loading';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';


@Component({
  selector: 'app-my-events',
  imports: [CommonModule, MatIcon, Loading, ReactiveFormsModule, MatFormFieldModule, MatInput],
  templateUrl: './my-events.html',
  styleUrl: './my-events.scss'
})
export class MyEvents {
  //Inicijalizujemo event na nas model Event koji ima deklarisane atribute
  events: Event[] = [];
  loading = true;
  filter = new FormControl('');
  filterList: Event[] = [];

  constructor(private apiService: MyEventsService, private router: Router) { }

  //standardna angularova kontrola sve sto je ove aktivira se odmah po ucitavanju ove komponente 
  ngOnInit(): void {
    this.loadEvents();
    this.setupFilter();
  }

  setupFilter() {
    this.filter.valueChanges.subscribe(res => {
      const searchTerm = res!.toLowerCase().trim();
      this.filterList = this.events.filter(item => {
        return (item.eventName?.toLowerCase().includes(searchTerm)) ||
          (item.city?.toLowerCase().includes(searchTerm)) ||
          (item.artist?.toLowerCase().includes(searchTerm)) ||
          (item.genre?.toLowerCase().includes(searchTerm));
      });
    });
  }


  //Funkcija koja ucitava eventove poziva apiService koji smo deklarisali u konstruktoru i subskrajbuje se na njega 
  //kupi podatke data je odgovor servera ta data se dodeljuje nasim eventima ovde i loading se stavlja na false
  // u slucaju greske  ide an error deo 
  loadEvents(): void {
    this.apiService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.filterList = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      }
    });
  }

  //ovde pozivom ove funkcije navigiramo an rutu event/id gde s ekasnije tu taj id vadi i prosledjuje nasem serveru d abi nam vratio tacan event
  openEventDetails(eventId: number): void {
    this.router.navigate(['/event', eventId]);
  }
}
