import { Component, OnInit } from '@angular/core';
import { Event } from '../Models/models';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminCreatedEventsService } from './admin-created-events.service';


@Component({
  selector: 'app-event',
  //CommonModule nam omogucava da koristimo osnovne angularove selektore kao sto je ngIf
  imports: [CommonModule, MatIcon],
  templateUrl: './admin-created-events.html',
  styleUrls: ['./admin-created-events.scss']
})
export class AdminCreatedEvents implements OnInit {

  //Inicijalizujemo event na nas model Event koji ima deklarisane atribute
  events: Event[] = [];
  loading = true;
  success = true;
  message = '';

  constructor(private apiService: AdminCreatedEventsService, private router: Router, private toastr: ToastrService) { }

  //standardna angularova kontrola sve sto je ove aktivira se odmah po ucitavanju ove komponente 
  ngOnInit(): void {
    this.loadEvents();
  }

  //Funkcija koja ucitava eventove poziva apiService koji smo deklarisali u konstruktoru i subskrajbuje se na njega 
  //kupi podatke data je odgovor servera ta data se dodeljuje nasim eventima ovde i loading se stavlja na false fora kdo ovoga je sto nas servis vraca samo eventove koje je krirao trenutno ulogovani korisnik taj deo se radi an beku
  //izgledoms vega ovoga mala je razlika od event komponente kako slicno funkcionise i izgleda
  // u slucaju greske  ide an error deo 
  loadEvents(): void {
    this.apiService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      }
    });
  }
  //funkcija koja brise eventove prosledjuje se id eventa i event kao Mouse event vazno je znati d aovaj event nema veze sa nasim eventovima
  //ovaj event MouseEvent je u sustini dogadja sa misem odnosno bice to klik
  deleteEvent(eventId: number, event: MouseEvent): void {
    //zaustavljamo propagaciju da posle brisanja ne bi probao d audje u sledeci sloj odnosno da udje u sam event kao posle drugog klika
    event.stopPropagation();
    //cekamo potvrdu korisnika ako klikne ok nastavljamo dalje
    if (confirm('Jeste li sigurni da želite da obrišete ovaj event?')) {
      //pozivmao ans servise kome prosledjujemo id eventa bek ce kasnije proveriti d ali smo mi vlansik i da li event postoji i obrisace ga ili ce nam vratiti sucess false i poruku
      this.apiService.deleteEvent(eventId).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success(response.message);
            this.loadEvents();
          } else {
            this.toastr.error(response.message);
          }
        },
        error: (err) => {
          this.toastr.error('Greska prilikom brisanja Eventa!');
          console.log(err);
        }
      });
    }
  }

  //ovde pozivom ove funkcije navigiramo an rutu event/id gde s ekasnije tu taj id vadi i prosledjuje nasem serveru d abi nam vratio tacan event
  openEventDetails(eventId: number): void {
    this.router.navigate(['/event', eventId]);
  }
}
