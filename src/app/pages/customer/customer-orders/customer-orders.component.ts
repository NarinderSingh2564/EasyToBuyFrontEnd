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
      this.orderService.getOrderList(0, this.accountService.getUserId(), "", "").subscribe((result: any) => {
        this.orderList = result
      })
    }
    
  }

  // searchProducts(searchText: string) {
  //   if (this.accountService.getUserRole() == "Vendor") {

  //     this.header = (this.statusId == 0) ? "All Orders" : (this.statusId == 1) ? "Pending Orders" : (this.statusId == 4) ? "Delivered Orders" : "Cancelled Orders";

  //     var newStatusId = (this.statusId == 0 ? "" : this.statusId == 1 ? '1,3' : this.statusId.toString());

  //     this.orderService.getOrderList(0, this.accountService.getUserId(), searchText, newStatusId).subscribe((result: any) => {
  //       this.orderList = result
  //     })
  //   }
  //   else {
  //     this.orderService.getOrderList(this.accountService.getUserId(), 0, searchText, "").subscribe((result: any) => {
  //       this.orderList = result
  //     })
  //   }
  // }
  

