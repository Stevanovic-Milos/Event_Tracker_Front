import { Component, OnInit } from '@angular/core';
import { Event } from '../Models/models';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { EventService } from './event.service';
import { MyEventsService } from '../my-events/my-events.service';
import { ToastrService } from 'ngx-toastr';
import { Loading } from '../loading/loading';
import { M } from "../../../node_modules/@angular/material/form-field.d-C6p5uYjG";
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-event',
  //CommonModule nam omogucava da koristimo osnovne angularove selektore kao sto je ngIf
  imports: [CommonModule, MatIcon, Loading, MatInputModule, ReactiveFormsModule],
  templateUrl: './event.html',
  styleUrls: ['./event.scss']
})
export class Events implements OnInit {

  //Inicijalizujemo event na nas model Event koji ima deklarisane atribute
  events: Event[] = [];
  loading = true;
  success = true;
  message = '';
  filterList: Event[] = [];
  filter = new FormControl('');
  constructor(private apiService: EventService, private router: Router, private subscribeService: MyEventsService, private toastr: ToastrService) { }

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

  //funkcija koja omogucava da na bek posaljemo event na koji zelimo da se subskrajbujemo
  onSubscribe(eventId: number, event: MouseEvent): void {
    //zaustavljamo da nas nakon svega ne bi poslalo na eventdetails 
    event.stopPropagation();
    this.subscribeService.subscribeOnEvent(eventId).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['my-events']);
          this.toastr.success(response.message);
        }
        else {
          this.toastr.error(response.message);
        }
      },
      error: (error) => {
        console.log('Greska:', error);
      }
    });
  }
}
