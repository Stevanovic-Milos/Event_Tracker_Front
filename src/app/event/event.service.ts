import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from '../Models/models'
import { DataService } from '../Shared/data.service';

@Injectable({
  providedIn: 'root'
})

//adresa poziva port na koji bek salje api sa kontrolera
export class EventService {
  private apiUrl = 'http://localhost:8080/api/events';

  constructor(private data: DataService) { }
  // vraca sve 
  getEvents(): Observable<Event[]> {
    console.log('Fetching events from API');
    return this.data.get<Event[]>(this.apiUrl);
  }

  getEventById(id: number): Observable<Event> {
  return this.data.post<Event>(`${this.apiUrl}/details`, { id: id });
}
}