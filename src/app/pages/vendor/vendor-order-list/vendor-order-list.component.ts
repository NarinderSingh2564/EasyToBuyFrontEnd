import { Component } from '@angular/core';
import { OrderListComponent } from '../../account/order-list/order-list.component';

@Component({
  selector: 'app-vendor-order-list',
  standalone: true,
  imports: [OrderListComponent],
  templateUrl: './vendor-order-list.component.html',
  styleUrl: './vendor-order-list.component.css'
})
export class VendorOrderListComponent {
  
}
