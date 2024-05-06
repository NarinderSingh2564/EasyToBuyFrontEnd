import { Component } from '@angular/core';
import { LoginComponent } from "../../account/login/login.component";

@Component({
    selector: 'app-admin-login',
    standalone: true,
    templateUrl: './admin-login.component.html',
    styleUrl: './admin-login.component.css',
    imports: [LoginComponent]
})
export class AdminLoginComponent {

}
