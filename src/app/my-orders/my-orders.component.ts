import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AccountService } from '../services/account.service';
import { AlertService } from '../services/alert.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  type: string | null = '';
  isLoggedin: boolean = false;
  user: any;
  orders: any;

  constructor(private accountService: AccountService, private orderService: OrderService,
    private router: Router, private alertService: AlertService) { }

  ngOnInit(): void {
    this.getData();
    this.router.events.subscribe((val) => {
      this.getData();
    });
  }
  getData() {
    if (this.accountService.isLoggedIn()) {
      this.type = localStorage.getItem('type');
      this.isLoggedin = true;
      if (localStorage.getItem('user') != null) {
        let userString: any = localStorage.getItem('user');
        this.user = JSON.parse(userString);
        this.getOrders();
      }
    }
    else {
      this.type = null;
    }
  }

  getOrders() {
    this.orderService.getPatientOrders(this.user._id).pipe(first())
      .subscribe(
        (data: any) => {
          this.orders = data;
        },
        (error: any) => {
          this.alertService.error(error);
        });
  }
}