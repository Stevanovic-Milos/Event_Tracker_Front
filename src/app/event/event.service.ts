import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Event, EventData, EventResponse, MyResponse } from '../Models/models'
import { DataService } from '../Shared/data.service';
import { environment } from '../Environments/environment';

@Injectable({
  providedIn: 'root'
})

//adresa poziva port na koji bek salje api sa kontrolera
export class EventService {
  private apiUrl = environment.apiUrl;

  constructor(private data: DataService) { }
  // vraca sve 
  getEvents(): Observable<Event[]> {
    console.log('Fetching events from API');
    return this.data.get<EventResponse>(`${this.apiUrl}/api/events`)
      .pipe(map(Response => Response.events))
  }

  getEventById(eventId: number): Observable<Event> {
    return this.data.post<EventResponse>(`${this.apiUrl}/api/events/details`, { eventId: eventId })
      //ovo nam je potrebno jer server vraca format event: pa tek onda objekat mi mapiramo sta nam treba iz toga d abi direktno kansije dodelili u pozivu
      // sada samo mozmeo pozvati this.event = ovaj api.event i dobicemo sve podatke
      .pipe(map(Response => Response.event));
  }
  createEvent(data: EventData) {
    return this.data.post<MyResponse>(`${this.apiUrl}/api/admin/events/create`, data);
  }
  editEventById(data: EventData) {
    return this.data.put<MyResponse>(`${this.apiUrl}/api/admin/events/edit`, data);

  }
}