import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Event, EventResponse, MyResponse } from '../Models/models'
import { DataService } from '../Shared/data.service';
import { environment } from '../Environments/environment';

@Injectable({
  providedIn: 'root'
})

//adresa poziva port na koji bek salje api sa kontrolera
export class MyEventsService {
  private apiUrl = environment.apiUrl + '/api/subscriptions';

  constructor(private data: DataService) { }
  // vraca sve evente jer bek na osnovu jwt-a zna koji je korisnik
  getEvents(): Observable<Event[]> {
    console.log('Fetching events from API');
    return this.data.get<EventResponse>(this.apiUrl)
    .pipe(map(Response => Response.events))
  }

  //ova funkcija se ne poziva ovde vec u eventu da se korisnik pretplati na event i doda u tabelu subscriptions
   subscribeOnEvent(eventId: number): Observable<MyResponse>{
    return this.data.post<MyResponse>(`${this.apiUrl}/subscribe`, {eventId: eventId} )
  }
}