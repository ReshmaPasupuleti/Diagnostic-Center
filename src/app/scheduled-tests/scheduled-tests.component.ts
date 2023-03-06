import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-scheduled-tests',
  templateUrl: './scheduled-tests.component.html',
  styleUrls: ['./scheduled-tests.component.css']
})
export class ScheduledTestsComponent implements OnInit {
  orders: any[] = [];
  testSlots: any[] = [];
  type: string | null = '';
  user: any;

  constructor(private orderService: OrderService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.getData();
  }
  getData() {
    this.type = localStorage.getItem('type');
    if (localStorage.getItem('user') != null) {
      let userString: any = localStorage.getItem('user');
      this.user = JSON.parse(userString);
    }
    if (this.type == "patient") {
      this.getPatientOrders(this.user._id);
    } else if (this.type == "employee") {
      this.getOrders();
    }
  }

  getPatientOrders(userId: any) {
    this.testSlots = [];
    this.orderService.getPatientOrders(userId).pipe(first())
      .subscribe(
        (data: any) => {
          data.forEach((order: any) => {
            order.testSlots.forEach((testSlot: any) => {
              this.testSlots.push(testSlot);
            });
          });
        },
        (error: any) => {
          this.alertService.error(error);
        });
  }
  getOrders() {
    this.testSlots = [];
    this.orderService.getOrders().pipe(first())
      .subscribe(
        (data: any) => {
          this.orders = data;
        },
        (error: any) => {
          this.alertService.error(error);
        });
  }

  startOrder(order: any) {
    this.updateOrder(order, "Test moved to In-Progress");
  }
  completeOrder(order: any) {
    this.updateOrder(order, "Test Completed, Reports sent to Email and Mobile");
  }
  updateOrder(order: any, message: string) {
    this.orderService.updateOrder(order).subscribe(res => {
      this.alertService.success(message);
    }, (err) => {
      this.alertService.error(err);
    })
  }

}
