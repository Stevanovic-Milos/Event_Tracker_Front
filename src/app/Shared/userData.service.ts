import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../Models/models'
import { DataService } from '../Shared/data.service';
import { environment } from '../Environments/environment';

@Injectable({
  providedIn: 'root'
})

//adresa poziva port na koji bek salje api sa kontrolera
export class UserDataService {
  private apiUrl = environment.apiUrl + '/api/UserDetails';

  constructor(private data: DataService) { }
  // vraca sve 
  getUserDetails(): Observable<User> {
    return this.data.get<User>(this.apiUrl);
  }
}