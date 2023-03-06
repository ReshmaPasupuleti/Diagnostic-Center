import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { AccountService } from '../services/account.service';
import { TestService } from '../services/test.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title = 'diagnostic center';

  type?: string | null;
  isLoggedin: boolean = false;
  user: any;
  cartSubscription?: Subscription;
  cartCount = 0;

  constructor(private accountService: AccountService,
    private router: Router, private testService: TestService) {
    this.getData();
    this.getCartCount();
    router.events.subscribe((val) => {
      this.getData();
      this.getCartCount();
    });
  }
  getData() {
    if (this.accountService.isLoggedIn()) {
      this.type = localStorage.getItem('type');
      this.isLoggedin = true;
      if (localStorage.getItem('user') != null) {
        let userString: any = localStorage.getItem('user');
        this.user = JSON.parse(userString);
      }
    }
    else {
      this.type = null;
    }
  }

  ngOnInit(): void {
    this.cartSubscription = this.testService.onCartUpdate("cart")
      .subscribe(isTestAdded => {
        this.getCartCount();
      });
  }

  getCartCount() {
    this.cartCount = 0;
    if (localStorage.getItem('cart') != null) {
      let cartString: any = localStorage.getItem('cart');
      this.cartCount = JSON.parse(cartString).length;
    }
  }

  logout() {
    this.accountService.logout();
    this.isLoggedin = false;
  }

}
