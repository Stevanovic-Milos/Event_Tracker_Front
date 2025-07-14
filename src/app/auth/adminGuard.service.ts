//ovo je nas AdmiNGuard on je zasluzan za dozvoljavanje pristupa odredjenim rutama iskljucivo korisnicima koji su admini u aplikaciji
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserDataService } from '../Shared/userData.service';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    constructor(
        private userDataService: UserDataService,
        private router: Router
    ) { }

    canActivate(): Observable<boolean> {
        //prvo izvlacimo podatke iz servisa o korisniku gde se nalazi rola
        //ulazimo u pipe dok jos imamo flow 
        return this.userDataService.getUserDetails().pipe(
            //mapiramo user i trazimo u njemu rolu ak opostoje user i rola vracamo true sto znaci da je user admin
            //map transformise iz Observable direktno u boolean 
            map(user => {
                if (user && user.role === 'ROLE_ADMIN') {
                    return true;
                }
                //vracamo korisnika na event (pocetnu) i vracamo false
                this.router.navigate(['/event']);
                return false;
            })
        );
    }

    isAdmin(): Observable<boolean> {
        return this.userDataService.getUserDetails().pipe(
            //mapiramo user i trazimo u njemu rolu ak opostoje user i rola vracamo true sto znaci da je user admin
            //map transformise iz Observable direktno u boolean 
            map(user => {
                if (user && user.role === 'ROLE_ADMIN') {
                    return true;
                }
                return false;
            })
        );
    }
}