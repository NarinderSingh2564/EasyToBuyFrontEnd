import { CommonModule, } from '@angular/common';
import { Component,inject } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { AccountService } from '../../../services/account.service';
import { ActivatedRoute, Router, RouteReuseStrategy } from '@angular/router';
import { EasyToBuyHelper } from '../../../helpers/EasyToBuyHelper';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})

export class OrderListComponent {

  router = inject(RouteReuseStrategy)
  orderService = inject(OrderService)
  accountService = inject(AccountService)

  header: string = ""
  orderList: any = []
  orderDetails:any ={}
  statusId: number = 0;
  role: string = this.accountService.getUserRole();
  variationImgUrl = EasyToBuyHelper.imageVariationBaseUrl
  orderNumber:string=""
   totalOrderAmount:any = 0;
  imgUrl = EasyToBuyHelper.imageBaseUrl

  constructor(private activatedRoute: ActivatedRoute) {
    this.router.shouldReuseRoute = function () {
       return false;
     };
    this.activatedRoute.params.subscribe((result: any) => {
      this.statusId = result.id 
    });
    this.getOrderList()
  }

  getOrderList() {
    if (this.accountService.getUserRole() == "Vendor") {
      this.header = (this.statusId == 0) ? "All Orders" : (this.statusId == 1) ? "Pending Orders" : (this.statusId == 5) ? "Delivered Orders" : "Cancelled Orders";

      this.orderService.getOrdersList( this.accountService.getCustomerId(), "", this.statusId,"", "").subscribe((result: any) => {

      this.orderService.getUserOrdersListByUserId(this.accountService.getUserId(), "", this.statusId).subscribe((result: any) => {

        this.orderList = result
      })
    }
    else {
      this.header = "Total Orders"

      this.orderService.getOrdersList(this.accountService.getCustomerId(),  "", 0,"", "").subscribe((result: any) => {

      this.orderService.getUserOrdersListByUserId(this.accountService.getUserId(), "", 0).subscribe((result: any) => {

        this.orderList = result
      })
    }
  }

  searchOrder(searchText: string) {
    if (this.accountService.getUserRole() == "Vendor") {
      this.header = (this.statusId == 0) ? "All Orders" : (this.statusId == 1) ? "Pending Orders" : (this.statusId == 4) ? "Delivered Orders" : "Cancelled Orders";

      this.orderService.getOrdersList( this.accountService.getCustomerId(), searchText, this.statusId,"", "").subscribe((result: any) => {

      this.orderService.getUserOrdersListByUserId(this.accountService.getUserId(), searchText, 0).subscribe((result: any) => {

        this.orderList = result
      })
    }
    else {
      this.orderService.getOrdersList(this.accountService.getCustomerId(),  searchText, 0,"", "").subscribe((result: any) => {
        this.orderList = result
      })
    }
  }

  getOrderDetails(orderId:number){
    this.orderDetails = this.orderList.filter((t:{id:any}) => t.id == orderId)[0]
  }

  customerOrderStatusUpdate(orderId:number){
     this.orderService.customerOrderStatusUpdate(this.accountService.getCustomerId(),orderId,2).subscribe((result:any) => {
      if(result.status){
        this.getOrderList()
      }
      else{
        alert(result.message)
      }

     })

    })
  }

  getProductDetailsByOrderNumberAndUserId(orderNumber: string) {
    this.orderService.getProductDetailsByOrderNumberAndUserId(orderNumber, this.accountService.getUserId()).subscribe((result: any) => {
      this.productDetailsList = result
      this.orderNumber = orderNumber
      this.totalOrderAmount = 0
      this.productDetailsList.forEach((item:any) => {
        this.totalOrderAmount += item.amountToBePaid
      });
    })

  }

}