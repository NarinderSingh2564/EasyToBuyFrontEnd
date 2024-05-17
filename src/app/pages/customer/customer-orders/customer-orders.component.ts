import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-orders.component.html',
  styleUrl: './customer-orders.component.css'
})
export class CustomerOrdersComponent {
  orderService = inject(OrderService)
  accountService = inject(AccountService)

  orderList: any = []

  constructor() {
    this.getOrderList()
  }

  getOrderList() {
    this.orderService.getOrderList(this.accountService.getUserId(), 0, "", "").subscribe((result: any) => {
      this.orderList = result
    })
  }

  searchProducts(searchText: string) {
    this.orderService.getOrderList(this.accountService.getUserId(), 0, searchText, "").subscribe((result: any) => {
      this.orderList = result
    })
  }

  filterOrdersByType(event: any) {
    this.orderService.getOrderList(this.accountService.getUserId(), 0, "", event.target.value).subscribe((result: any) => {
      this.orderList = result
    })
  }
}