import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, filter } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Test } from '../models/test';

@Injectable({
  providedIn: 'root'
})
export class TestService {


  constructor(private http: HttpClient) { }

  private cartUpdate = new Subject<boolean>();

  private defaultId = 'cart';

  updatedCart(isProductAdded: boolean) {
    this.cartUpdate.next(isProductAdded);
  }

  onCartUpdate(id = this.defaultId): Observable<boolean> {
    return this.cartUpdate.asObservable().pipe(filter(x => x));
  }

  getTests() {
    return this.http.get(`${environment.apiUrl}tests`);
  }

  create(test: Test) {
    return this.http.post(`${environment.apiUrl}tests/create`, test);
  }

  deleteTest(testId:any){
    return this.http.delete(`${environment.apiUrl}tests/delete/${testId}`);
  }



}
