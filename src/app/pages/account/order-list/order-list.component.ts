import { CommonModule, } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { AccountService } from '../../../services/account.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent {

  orderService = inject(OrderService)
  accountService = inject(AccountService)

  orderList: any = []
  role: string = this.accountService.getUserRole();
  statusId: number = 0;
  header: string = ""

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe((result: any) => {
      this.statusId = result.id
    })
    this.getOrderList()
  }

  getOrderList() {
    if (this.accountService.getUserRole() == "Vendor") {
      this.header = (this.statusId == 0) ? "All Orders" : (this.statusId == 1) ? "Pending Orders" : (this.statusId == 4) ? "Delivered Orders" : "Cancelled Orders";

      var newStatusId = (this.statusId == 0 ? "" : this.statusId == 1 ? '1,3' : this.statusId.toString());

      this.orderService.getOrderList(0, this.accountService.getUserId(), "", newStatusId).subscribe((result: any) => {
        this.orderList = result
      })
    }
    else {
      this.header = "My Orders"
      this.orderService.getOrderList(this.accountService.getUserId(), 0, "", "").subscribe((result: any) => {
        this.orderList = result
      })
    }
  }

  searchProducts(searchText: string) {
    if (this.accountService.getUserRole() == "Vendor") {

      this.header = (this.statusId == 0) ? "All Orders" : (this.statusId == 1) ? "Pending Orders" : (this.statusId == 4) ? "Delivered Orders" : "Cancelled Orders";

      var newStatusId = (this.statusId == 0 ? "" : this.statusId == 1 ? '1,3' : this.statusId.toString());

      this.orderService.getOrderList(0, this.accountService.getUserId(), searchText, newStatusId).subscribe((result: any) => {
        this.orderList = result
      })
    }
    else {
      this.orderService.getOrderList(this.accountService.getUserId(), 0, searchText, "").subscribe((result: any) => {
        this.orderList = result
      })
    }
  }

}