import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Event, EventResponse, MyResponse } from '../Models/models'
import { DataService } from '../Shared/data.service';
import { environment } from '../Environments/environment';

@Injectable({
  providedIn: 'root'
})

//adresa poziva port na koji bek salje api sa kontrolera
export class AdminCreatedEventsService {
  private apiUrl = environment.apiUrl;

  constructor(private data: DataService) { }
  // vraca sve 
  getEvents(): Observable<Event[]> {
    console.log('Fetching events from API');
    return this.data.get<EventResponse>(`${this.apiUrl}/api/admin/events/user`)
      .pipe(map(Response => Response.events))
  }

  //servis za brisanje eventa uradjen po rest standardu za brisanje 
  //prosledjujemo event
   deleteEvent(eventId: number): Observable<MyResponse> {
    //event ce  ici u telo poziva direktno i na beku cemo iz api poziva izvuci eventId direktno koji kasnije koristimo
    // nase header automatski salje jwt uz svaki poziv odatle vadimo korisnika na beku pa ovde nema potrebe za slanjem bilo cega drugog
    return this.data.delete<MyResponse>(
      `${this.apiUrl}/api/admin/events/delete/${eventId}`
    );
  }
}