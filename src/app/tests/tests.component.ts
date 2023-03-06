import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { TestSlot } from '../models/order';
import { Test } from '../models/test';
import { AccountService } from '../services/account.service';
import { AlertService } from '../services/alert.service';
import { TestService } from '../services/test.service';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css']
})
export class TestsComponent implements OnInit {

  tests: any[] = [];
  cartTestSlots: any;
  type: string | null = '';
  isLoggedin: boolean = false;
  user: any;
  dates: Date[] = [];
  date: Date = new Date();

  constructor(private testService: TestService, private alertService: AlertService,
    private accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
    this.getData();
    this.getTests();
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

  getTests() {
    this.testService.getTests().pipe(first())
      .subscribe(
        (data: any) => {
          this.tests = data;
          this.cartTestSlots.forEach((testSlot: any) => {
            this.dates[this.tests.findIndex((test: any) => testSlot.test._id == test._id)] = testSlot.time;
          })
        },
        (error: any) => {
          this.alertService.error(error);
        });
  }
  delete(testId: any) {
    this.testService.deleteTest(testId).pipe(first())
      .subscribe(
        (data: any) => {
          this.tests.forEach((element, index) => {
            if (element._id == testId) this.tests.splice(index, 1);
          });
          this.alertService.success(data.message);
        },
        (error: any) => {
          this.alertService.error(error);
        });
  }

  inCart(testId: any) {
    return this.cartTestSlots.find((p: any) => p.test._id == testId) != null;
  }

  addToCart(test: Test, date: Date) {
    if (date) {
      let testSlot: TestSlot = {
        status: 'upcoming',
        time: date,
        test: test,
        reportSent: false
      }
      this.cartTestSlots.push(testSlot);
      localStorage.setItem('cart', JSON.stringify(this.cartTestSlots));
      this.testService.updatedCart(true);
      this.alertService.success("Test Added to Cart Sucessfully");
    } else {
      this.alertService.error("Please select Date and Time");
    }
  }

  removeFromCart(testId: any) {
    this.cartTestSlots = this.cartTestSlots.filter((testSlot: any) => {
      return testSlot.test._id != testId;
    })
    localStorage.setItem('cart', JSON.stringify(this.cartTestSlots));
    this.testService.updatedCart(true);
    this.alertService.success("Test Removed from Cart Sucessfully");
  }

  continue() {
    if (this.cartTestSlots.length > 0) {
      this.router.navigateByUrl("/payment");
    } else {
      this.alertService.error("Select atleast one Test to Continue.")
    }
  }

}
