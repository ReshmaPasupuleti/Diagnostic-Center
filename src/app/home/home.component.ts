import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  type?: string | null;
  isLoggedin: boolean = false;
  user: any;
  cartTests: any = [];

  constructor(private accountService: AccountService,
    private router: Router,
    private alertService: AlertService) { }

  getData() {
    this.cartTests = [];
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
          this.cartTests = JSON.parse(cartString);
        }
      }
    }
    else {
      this.type = null;
    }
  }

  ngOnInit(): void {
    this.getData();
  }

}
