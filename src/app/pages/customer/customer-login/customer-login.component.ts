import { Component, Input } from '@angular/core';
import { LoginComponent } from "../../account/login/login.component";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RouterLink,Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';

@Component({
    selector: 'app-customer-login',
    standalone: true,
    templateUrl: './customer-login.component.html',
    styleUrl: './customer-login.component.css',
    imports: [LoginComponent,FormsModule,RouterLink,CommonModule,ReactiveFormsModule]
})
export class CustomerLoginComponent {

  role = "Customer";
  
}
