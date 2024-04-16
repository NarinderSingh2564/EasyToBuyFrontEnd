import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-customer-address',
  standalone: true,
  imports: [],
  templateUrl: './customer-address.component.html',
  styleUrl: './customer-address.component.css'
})
export class CustomerAddressComponent {

  @Input() UserID: any;

  // @Input() UserID: number;


}
