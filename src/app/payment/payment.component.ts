import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { Order, TestSlot } from '../models/order';
import { Test } from '../models/test';
import { AccountService } from '../services/account.service';
import { AlertService } from '../services/alert.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  paymentForm: FormGroup;
  loading = false;
  submitted = false;
  type?: string | null;
  isLoggedin: boolean = false;
  user: any;
  cartTestSlots: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private orderService:OrderService
  ) {
    this.paymentForm = this.formBuilder.group({
      cardOwner: ['', Validators.required],
      cardNumber: ['', Validators.required],
      expiry: ['', Validators.required]
    });
    this.getData();
    router.events.subscribe((val) => {
      this.getData();
    });
  }
  getData() {
    this.cartTestSlots = [];
    if (this.accountService.isLoggedIn()) {
      this.type = localStorage.getItem('type');
      this.isLoggedin = true;
      if (localStorage.getItem('user') != null) {
        let userString: any = localStorage.getItem('user');
        this.user = JSON.parse(userString);
      }
      if (this.type == "patient") {
        if (localStorage.getItem('cart') != null) {
          let cartString: any = localStorage.getItem('cart');
          this.cartTestSlots = JSON.parse(cartString);
        }
      }
    }
    else {
      this.type = null;
    }
  }
  ngOnInit(): void {
  }

  get f() { return this.paymentForm.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.paymentForm.invalid) {
      return;
    }
    this.loading = true;
    this.orderService.placeOrder(this.getOrder(this.paymentForm.value))
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.alertService.success(data.message);
          this.router.navigate(['/orders', data.data._id], { relativeTo: this.route });
          localStorage.removeItem('cart');
        },
        (error: any) => {
          this.alertService.error(error);
          this.loading = false;
        });
  }
  getOrder(value: any): Order {
    let order: Order = {
      totalAmount: this.getOrderTotal(),
      payment: {
        cardOwner: value.cardOwner,
        cardNumber: value.cardNumber,
        expiry: value.expiry
      },
      testSlots: this.cartTestSlots,
      patient: this.user,
    }
    return order;
  }

  getOrderTotal(): number {
    let total: number = 0;
    this.cartTestSlots.forEach(function (testSlot: TestSlot) {
      total += testSlot.test.price;
    });
    return total;
  }

}
