import { Component } from '@angular/core';
import { LoginComponent } from "../../account/login/login.component";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-customer-login',
    standalone: true,
    templateUrl: './customer-login.component.html',
    styleUrl: './customer-login.component.css',
    imports: [LoginComponent,FormsModule,RouterLink,CommonModule,ReactiveFormsModule]
})
export class CustomerLoginComponent {
  
}
