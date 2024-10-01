import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { OrderService } from '../../../services/order.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EasyToBuyHelper } from '../../../helpers/EasyToBuyHelper';

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-orders.component.html',
  styleUrl: './customer-orders.component.css'
})
export class CustomerOrdersComponent {

  orderService = inject(OrderService)
  accountService = inject(AccountService)
  router = inject(Router)

  orderList: any = []
  orderNumber: string = ""
  orderStatusTrackingList: any = []
  currentStatusId: number = 0
  timelineHeight: boolean = false
  baseUrl: string = EasyToBuyHelper.imageBaseUrl;
  reviewDes: string = '';
  ratingNumber : number = 0; 

  constructor() {
    this.getOrderList()
  }

  getOrderList() {
    this.orderService.getOrdersList(this.accountService.getCustomerId(), "", 0, "", "").subscribe((result: any) => {
      this.orderList = result
    })
  }

  searchProducts(searchText: string) {
    this.orderService.getOrdersList(this.accountService.getCustomerId(), searchText, 0, "", "").subscribe((result: any) => {
      this.orderList = result
    })
  }

  filterOrdersByType(event: any) {
    this.orderService.getOrdersList(this.accountService.getCustomerId(), "", event.target.value, "", "").subscribe((result: any) => {
      this.orderList = result
    })
  }

  filterOrdersByMonth(event: any) {
    if (event.target.value == 1) {
      var FirstDate = new Date();
      FirstDate.setMonth(FirstDate.getMonth() - 1);
      this.orderService.getOrdersList(this.accountService.getCustomerId(), "", 0, FirstDate.toLocaleDateString(), (new Date()).toLocaleDateString()).subscribe((result: any) => {
        this.orderList = result
      })
    }
    else if (event.target.value == 3) {
      var FirstDate = new Date();
      FirstDate.setMonth(FirstDate.getMonth() - 3);
      this.orderService.getOrdersList(this.accountService.getCustomerId(), "", 0, FirstDate.toLocaleDateString(), (new Date()).toLocaleDateString()).subscribe((result: any) => {
        this.orderList = result
      })
    }
    else {
      var FirstDate = new Date();
      FirstDate.setMonth(FirstDate.getMonth() - 6);
      this.orderService.getOrdersList(this.accountService.getCustomerId(), "", 0, FirstDate.toLocaleDateString(), (new Date()).toLocaleDateString()).subscribe((result: any) => {
        this.orderList = result
      })
    }
  }

  filterOrdersByDates(firstDate: any, secondDate: any) {
    this.orderService.getOrdersList(this.accountService.getCustomerId(), "", 0, firstDate, secondDate).subscribe((result: any) => {
      this.orderList = result
    })
  }

  getProductDescription(productId: number) {
    this.router.navigate(['product-description', productId])
  }

  getOrderNumber(orderNo: string) {
    this.orderNumber = orderNo
  }

  getOrderStatusTrackingList(orderId: number, statusId: number) {
    this.currentStatusId = statusId
    this.timelineHeight = false
    if (this.currentStatusId == 5 || this.currentStatusId == 6) {
      this.timelineHeight = true
    }
    this.orderService.getOrderStatusTrackingList(orderId).subscribe((result: any) => {
      this.orderStatusTrackingList = []
      if (result[0].isPending == true && result[4].isPending == true) {
        this.orderStatusTrackingList.push(result[0])
        this.orderStatusTrackingList.push(result[4])
      }
      else if (result[0].isPending == true && result[5].isPending == true) {
        this.orderStatusTrackingList.push(result[0])
        this.orderStatusTrackingList.push(result[5])
      }
      else {
        this.orderStatusTrackingList.push(result[0])
        this.orderStatusTrackingList.push(result[1])
        this.orderStatusTrackingList.push(result[2])
        this.orderStatusTrackingList.push(result[3])
        this.orderStatusTrackingList.push(result[4])
      }
    })
    console.log(this.orderStatusTrackingList)
  }
  mySet(myvalues : any){
    this.reviewDes = myvalues.reviewTitle;
    this.ratingNumber = myvalues.ratingNumber;
    console.log(this.reviewDes,this.ratingNumber);
 }

}