import { Component } from '@angular/core';
import { LoginComponent } from "../../account/login/login.component";

@Component({
    selector: 'app-customer-login',
    standalone: true,
    templateUrl: './customer-login.component.html',
    styleUrl: './customer-login.component.css',
    imports: [LoginComponent]
})
export class CustomerLoginComponent {

}
