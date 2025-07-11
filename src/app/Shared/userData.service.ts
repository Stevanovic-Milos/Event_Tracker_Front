import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../Models/models'
import { DataService } from '../Shared/data.service';

@Injectable({
  providedIn: 'root'
})

//adresa poziva port na koji bek salje api sa kontrolera
export class UserDataService {
  private apiUrl = 'http://localhost:8080/api/UserDetails';

  constructor(private data: DataService) { }
  // vraca sve 
  getUserDetails(): Observable<User> {
    return this.data.get<User>(this.apiUrl);
  }
}