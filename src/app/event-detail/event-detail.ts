import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Event } from '../Models/models';
import { EventService } from '../event/event.service';
import { SafeUrlPipe } from "../Pipes/safeUrl.pipe";
import { Loading } from '../loading/loading';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe, Loading],
  templateUrl: './event-detail.html',
  styleUrls: ['./event-detail.scss'],
  providers: [DatePipe]
})
export class EventDetail implements OnInit {
  // ovde deklarismeo nase promenjive postavili smo ! znak kod eventa da ne bismo radili provere da li postoji
  // znamo da ce sigurno postojati zbog toga sto je on vec sigurno ucitan u nasim eventima na event ruti
  event!: Event;
  loading = true;
  error: string | null = null;

  //ovde smo uvezli ruter i event servis kojim pozivamo jednu event metodu
  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
  ) { }

  //ovo je veoma bitan deo jer kada se na event sekciji klikne na odredjeni event on c enas poslati na stranicu
  // event/id taj id predstavlja id kliknutog eventa mi ovde uzimamo taj id preko router parms i postavljamo nas eventId da zna o kom eventu se radi
  // id je bitan d abi mogli na beku d avratimo podatke za bas taj event 
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const eventId = +params['id'];
      //ovde pozivamo ansu funkciju koja hvata event na osnovu id-a
      this.fetchEventDetails(eventId);
    });
  }

  //funkcija koja hvata event na osnovu id-a eventa
  fetchEventDetails(eventId: number): void {
    this.loading = true;
    this.error = null;

    this.eventService.getEventById(eventId).subscribe({
      next: (res) => {
        this.event = res;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load event details';
        this.loading = false;
        console.error(error);
      }
    });
  }
}