import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Event} from '../Models/models'

@Injectable({
  providedIn: 'root'
})

//adresa poziva port na koji bek salje api sa kontrolera
export class ApiService {
  private apiUrl = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient) { }
// vraca sve 
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }
//vraca na osnovu Id-a
  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }
//Kreira novi event
  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }
//Azurira event
  updateEvent(id: number, event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, event);
  }
//Brise event
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}