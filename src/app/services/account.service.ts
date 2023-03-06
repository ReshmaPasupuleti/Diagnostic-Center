import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private router: Router, private http: HttpClient) { }

  isLoggedIn() {
    if (localStorage.getItem("isLoggedIn")) {
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem('type');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    this.router.navigate(['/login']);
  }



  register(user: any, type: string) {
    return this.http.post(`${environment.apiUrl}register/${type}`, user);
  }

  login(email: string, password: string, type: string) {
    return this.http.post(`${environment.apiUrl}login`, { email, password, type })
      .pipe(map((res: any) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        if (res.data.length) {
          localStorage.setItem('isLoggedIn', JSON.stringify(true));
          localStorage.setItem('type', type);
          localStorage.setItem('user', JSON.stringify(res.data[0]));
        }
        return res;
      }));
  }
}
