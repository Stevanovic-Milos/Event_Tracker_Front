import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { EventService } from '../event/event.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Event, EventData } from '../Models/models';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-edit-event',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatTimepickerModule,
    MatSelect,
    MatOption
  ],
  templateUrl: './edit-event.html',
  styleUrl: './edit-event.scss'
})
export class EditEvent implements OnInit {
  eventData: EventData | null = null;
  // uzvicnik oznacava da ga sigurno imamo i d amozemo da g incijalizujemo bez brige a kasnije cmeo mu dodeliti vrednost
  event!: Event;
  // postavljamo incijalno eventId na 0 posle se menja akd uzmemo neki realan event
  eventId = 0;

  eventForm = new FormGroup({
    //eventName je novi formkontrol koji vucemo iz htmla postavljamo da bude prazno sa '' a validators.required  obezbedjuje da ovo polje mora da se popuni i to name
    //vraca u mat eroru tako proveravamo validnost polja
    eventName: new FormControl('', Validators.required),
    artist: new FormControl('', Validators.required),
    eventImageUrl: new FormControl(''),
    //ovo polje nema required zato nece imati greske i kada je prazno jer video nece biti obavezan
    videoUrl: new FormControl(''),
    //ovde imamo i min validator koji c evracati gresku ako je vrednost manaj od 0 (broj karata ne moze biti negativan)
    availableTickets: new FormControl(100, [Validators.required, Validators.min(0)]),
    city: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    soldOut: new FormControl(false, Validators.required),
    //opis sa ddatnim validatorom koji broji karaktere opis mora imati bar 20 karaktera
    description: new FormControl('', [Validators.required, Validators.minLength(20)]),
    //ovo je datum poctka koji se uzima kao Date ili null i postavlja se na null inicjalno
    eventDate: new FormControl<Date | null | string>(null, Validators.required),
    //vreme postavljamo na string 12:00
    eventTime: new FormControl('12:00', Validators.required),
    endDate: new FormControl<Date | null | string>(null, Validators.required),
    endTime: new FormControl('13:00', Validators.required),
    genre: new FormControl('', Validators.required),
    minAge: new FormControl(18, Validators.min(0)),
    organizer: new FormControl<string | null>(null),
    ticketPrice: new FormControl(0, [Validators.required, Validators.min(0)]),
    venue: new FormControl('', Validators.required),
    webUrlKarte: new FormControl('', Validators.required)
  });

  constructor(
    private eventService: EventService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
    //inicijalizujemo formu u konstruktoru da ne bi doslo do gresaka
  ) { }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const eventId = +params['id'];
      this.eventId = eventId;
      //ovde pozivamo ansu funkciju koja hvata event na osnovu id-a
      this.fetchEventDetails(eventId);
    });

  }
  fetchEventDetails(eventId: number): void {
    this.eventService.getEventById(eventId).subscribe({
      next: (res) => {
        this.event = res;
        this.formSetValue();


      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  formSetValue() {
    this.eventForm.setValue({
      eventName: this.event.eventName,
      artist: this.event.artist,
      eventImageUrl: this.event.eventImageUrl,
      videoUrl: this.event.eventVideoUrl,
      availableTickets: this.event.availableTickets,
      city: this.event.city,
      soldOut: this.event.soldOut,
      country: this.event.country,
      description: this.event.description,
      eventDate: this.extractDateFromISO(this.event.eventDate),
      eventTime: this.extractTimeFromISO(this.event.eventDate),
      endDate: this.extractDateFromISO(this.event.endDate),
      endTime: this.extractTimeFromISO(this.event.endDate),
      genre: this.event.genre,
      minAge: this.event.minAge,
      organizer: this.event.organizer,
      ticketPrice: this.event.ticketPrice,
      venue: this.event.venue,
      webUrlKarte: this.event.ticketWebsiteUrl

    })
  }


  //funkcija se poziva klikom na dugme
  onSubmit(): void {
    //pozivamo nasu funkciju
    this.prepareEventData();
    //proveravamo da li je nas eventData prazan ako jeste necemo dozvoliti da se nastavi
    if (!this.eventData) {
      this.toastr.error('Neko od polja je prazno i ne mzoete predati formu');
      return;
    }
    //kreiramo event prosledjujemo nas form data koji je direktno model EventData iz modela
    this.eventService.editEventById(this.eventData).subscribe({
      //uzimamo odgovor koji je tipa MyResponse
      next: (response) => {
        //ako bek vrati sucess true onda prikazujemo poruku i redirektujemo naseg admina na njegove eventove
        if (response.success) {
          this.toastr.success(response.message);
          this.router.navigate(['admin-events']);
        }
        //ako je sve proslo ali je odgov sucess false prikazujemo samo poruku
        else {
          this.toastr.error(response.message);
        }
      },
      //ako dodje do greske prikazujemo gresku u toastr  i konyoli
      error: (err) => {
        console.log('Greška pri izmeni eventa:', err);
        this.toastr.error('Greška pri izmeni eventa');
      }
    });
  }

  //u ovoj funkciji pripremamo nase podatke koju su tipa
  private prepareEventData(): void {

    //formValue su sve vrednosti iz nase eventForme 
    const formValue = this.eventForm.value;

    // Moramo da validiramo nas apolja koja cemo spajati da bi funcija sigurno
    if (!formValue.eventDate || !formValue.eventTime ||
      !formValue.endDate || !formValue.endTime) {
      console.log('Greska neko od obaveznih polja za vreme i datum nije popunjeno');
      return;
    }

    //kreiramo nas eventData od polja iz forme ovaj deo ?? je u slucaju da nema vrednosti inicjalizujemo sa '' jer polje po nasem modleu ne mzoe biti prazno niakda
    this.eventData = {
      eventId: this.eventId,
      eventName: formValue.eventName ?? '',
      artist: formValue.artist ?? '',
      eventImageUrl: formValue.eventImageUrl ?? '',
      eventVideoUrl: formValue.videoUrl ?? null,
      availableTickets: formValue.availableTickets ?? 0,
      city: formValue.city ?? '',
      country: formValue.country ?? '',
      soldOut: formValue.soldOut,
      description: formValue.description ?? '',
      genre: formValue.genre ?? '',
      minAge: formValue.minAge ?? 18,
      organizer: formValue.organizer ?? '',
      ticketPrice: formValue.ticketPrice ?? 0,
      venue: formValue.venue ?? '',
      //u nasoj bazi polja eventDate i endDate su iso format znaci da su datum i vreme u iso formatu a mi ovde uzimamo zasebno datum i zasebno vreme 
      //kreirali smo funkciju combineDateTime koja spaja ovo vreme i datum u iso format kako nas bek i ocekuje da ih dobije 
      eventDate: this.combineDateTime(formValue.eventDate, formValue.eventTime),
      endDate: this.combineDateTime(formValue.endDate, formValue.endTime),
      ticketWebsiteUrl: formValue.webUrlKarte ?? ''
    };
  }
  private combineDateTime(date: Date | string, time: string): string {
    // Ako je date string, parsiraj ga u Date objekat
    const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);

    // Izdvojite sate i minute iz vremenskog stringa
    const [hours, minutes] = time.split(':').map(Number);

    // Kreirajte novi Date objekat sa UTC vremenom jer iso kroisti utc vreme
    const utcDate = new Date(Date.UTC(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate(),
      hours,
      minutes,
      0,  // sekunde
      0   // milisekunde
    ));

    // Vratite ISO string
    return utcDate.toISOString();
  }
  private extractDateFromISO(isoString: string): Date {
    if (!isoString) return new Date();
    const date = new Date(isoString);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
  private extractTimeFromISO(isoString: string): string {
    if (!isoString) return '12:00';
    const date = new Date(isoString);
    // Dodajemo leading zero ako je potrebno
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
