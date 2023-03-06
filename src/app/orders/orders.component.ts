import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';
import { AccountService } from '../services/account.service';
import { AlertService } from '../services/alert.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orderId: any;
  order: any;

  constructor(private route: ActivatedRoute,
    private orderService: OrderService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get("id");
    this.orderService.getOrderById(this.orderId).pipe(first())
      .subscribe(
        (data: any) => {
          this.order = data[0];
        },
        (error: any) => {
          this.alertService.error(error);
        });
  }

}
