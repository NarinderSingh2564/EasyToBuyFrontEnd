import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { OrderService } from '../../../services/order.service';
import {FormsModule}   from '@angular/forms';

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [CommonModule,FormsModule],
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
    this.orderService.getOrderList(this.accountService.getUserId(), 0, "", "","", "").subscribe((result: any) => {
      this.orderList = result
    })
  }

  searchProducts(searchText: string) {
    this.orderService.getOrderList(this.accountService.getUserId(), 0, searchText, "","", "").subscribe((result: any) => {
      this.orderList = result
    })
  }

  filterOrdersByType(event: any) {
    this.orderService.getOrderList(this.accountService.getUserId(), 0, "", event.target.value,"", "").subscribe((result: any) => {
      this.orderList = result
    })
  }

filterOrdersByMonth(event:any)
  {
    if(event.target.value == 1)
      {
        var FirstDate = new Date();
        FirstDate.setMonth(FirstDate.getMonth() - 1);
        this.orderService.getOrderList(this.accountService.getUserId(), 0, "", "",FirstDate.toLocaleDateString() ,(new Date()).toLocaleDateString()).subscribe((result: any) => {
          this.orderList = result
        })
      }
      else if(event.target.value == 3)
        {
          var FirstDate = new Date();
        FirstDate.setMonth(FirstDate.getMonth() - 3);
        this.orderService.getOrderList(this.accountService.getUserId(), 0, "", "",FirstDate.toLocaleDateString() ,(new Date()).toLocaleDateString()).subscribe((result: any) => {
          this.orderList = result
        })
        }
        else{
          var FirstDate = new Date();
          FirstDate.setMonth(FirstDate.getMonth() - 6);
          this.orderService.getOrderList(this.accountService.getUserId(), 0, "", "",FirstDate.toLocaleDateString() ,(new Date()).toLocaleDateString()).subscribe((result: any) => {
            this.orderList = result
          })
        }
  }

  filterOrdersByDates(firstDate:any, secondDate:any){
    this.orderService.getOrderList(this.accountService.getUserId(), 0,"", "",firstDate, secondDate).subscribe((result: any) => {
      this.orderList = result
    })
  }
}