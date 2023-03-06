import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  getPatientOrders(_id: any) {
    return this.http.get(`${environment.apiUrl}orders/patient/${_id}`);
  }

  placeOrder(order: Order) {
    return this.http.post(`${environment.apiUrl}orders/create`, order);
  }
  updateOrder(order: Order) {
    return this.http.put(`${environment.apiUrl}orders/update`, order);
  }

  getOrderById(orderId: any) {
    return this.http.get(`${environment.apiUrl}orders/${orderId}`);
  }
  getOrders() {
    return this.http.get(`${environment.apiUrl}orders`);
  }
}
