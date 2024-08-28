import { Component } from '@angular/core';
import { LoginComponent } from "../../account/login/login.component";

@Component({
    selector: 'app-vendor-login',
    standalone: true,
    templateUrl: './vendor-login.component.html',
    styleUrl: './vendor-login.component.css',
    imports: [LoginComponent]
})
export class VendorLoginComponent {

}
