import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTestComponent } from './add-test/add-test.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { OrdersComponent } from './orders/orders.component';
import { PaymentComponent } from './payment/payment.component';
import { RegisterComponent } from './register/register.component';
import { ScheduledTestsComponent } from './scheduled-tests/scheduled-tests.component';
import { TestsComponent } from './tests/tests.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tests', component: TestsComponent },
  { path: 'add-test', component: AddTestComponent },
  { path: 'scheduled-tests', component: ScheduledTestsComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'orders', component: MyOrdersComponent },
  { path: 'orders/:id', component: OrdersComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
