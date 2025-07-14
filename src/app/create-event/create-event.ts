import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { EventService } from '../event/event.service';
import { CommonModule } from '@angular/common';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { ToastrService } from 'ngx-toastr';
import { EventData } from '../Models/models';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatTimepickerModule,
  ],
  templateUrl: './create-event.html',
  styleUrls: ['./create-event.scss']
})
export class CreateEvent {
  eventData: EventData | null = null;
  //ovoj je formFroup to je kao veliki wrapper, sa dosta form kontrola, to je roditeljska komponenta u kojoj cuvamo sve ove male formice
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
    //opis sa ddatnim validatorom koji broji karaktere opis mora imati bar 20 karaktera
    description: new FormControl('', [Validators.required, Validators.minLength(20)]),
    //ovo je datum poctka koji se uzima kao Date ili null i postavlja se na null inicjalno
    eventDate: new FormControl<Date | null>(null, Validators.required),
    //vreme postavljamo na string 12:00
    eventTime: new FormControl('12:00', Validators.required),
    endDate: new FormControl<Date | null>(null, Validators.required),
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
  ) { }

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
    this.eventService.createEvent(this.eventData).subscribe({
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
        console.log('Greška pri kreiranju eventa:', err);
        this.toastr.error('Greška pri kreiranju eventa');
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

    //kreiramo nas eventData od polja iz forme ovaj deo ?? je u slucaju d anema vrednosti inicjalizujemo sa '' jer polje po nasem modleu ne mzoe biti prazno niakda
    this.eventData = {
      eventName: formValue.eventName ?? '',
      artist: formValue.artist ?? '',
      eventImageUrl: formValue.eventImageUrl ?? '',
      eventVideoUrl: formValue.videoUrl ?? null,
      availableTickets: formValue.availableTickets ?? 0,
      city: formValue.city ?? '',
      country: formValue.country ?? '',
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
  //kombinacija stringa vremena sa normalnim datumom kako bi se kritalo iso format koji se cuva u bazi
  private combineDateTime(date: Date, time: string): string {
    // kreirmao novi newDate kako bi smo ibegli nezeljene greske on c edirektno biti nas date koji prosledimo u Date formatu
    const newDate = new Date(date);

    //Kako mi vracamo string nasim timepickerom secemo string na mestu : prvi deo dodeljujemo za sate a drugi za minute
    const [hours, minutes] = time.split(':').map(Number);

    // Koristimo Date funkcije postavljamo sate na anse sate minute na minure sekunde i milisekunde na 0 jer iso format zahteva i njih
    newDate.setUTCHours(hours);
    newDate.setUTCMinutes(minutes);
    newDate.setUTCSeconds(0);
    newDate.setUTCMilliseconds(0);
    //vracamo nas newDate kao isoString 
    return newDate.toISOString();
  }
}