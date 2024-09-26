import { CommonModule, } from '@angular/common';
import { Component, inject } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { AccountService } from '../../../services/account.service';
import { ActivatedRoute, RouteReuseStrategy } from '@angular/router';
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
  productDetailsList: any = []
  statusId: number = 0;
  totalOrderAmount:any = 0;
  variationImgUrl = EasyToBuyHelper.imageVariationBaseUrl

  constructor(private activatedRoute: ActivatedRoute) {
    this.router.shouldReuseRoute = function () {
      return false;
    };
    this.activatedRoute.params.subscribe((result: any) => {
      this.statusId = result.id
    });
    this.getUserOrdersListByUserId()
  }

  getUserOrdersListByUserId() {
    if (this.accountService.getUserRole() == "Vendor") {
      this.header = (this.statusId == 0) ? "All Orders" : (this.statusId == 1) ? "Pending Orders" : (this.statusId == 5) ? "Delivered Orders" : "Cancelled Orders";

      

      this.orderService.getOrdersList( this.accountService.getUserId(), "", this.statusId,"", "").subscribe((result: any) => {

        this.orderList = result
      })
    }
    else {
      this.header = "Total Orders"

      this.orderService.getUserOrdersListByUserId(this.accountService.getUserId(), "", 0).subscribe((result: any) => {



        this.orderList = result
      })
    }
  }

  searchOrder(searchText: string) {
    if (this.accountService.getUserRole() == "Vendor") {
      this.header = (this.statusId == 0) ? "All Orders" : (this.statusId == 1) ? "Pending Orders" : (this.statusId == 4) ? "Delivered Orders" : "Cancelled Orders";

        this.orderService.getOrdersList( this.accountService.getUserId(), searchText, this.statusId,"", "").subscribe((result: any) => {

        this.orderList = result
      })
    }
    else {
      this.orderService.getUserOrdersListByUserId(this.accountService.getUserId(), searchText, 0).subscribe((result: any) => {
        this.orderList = result
      })
    }
  }

  customerOrderStatusUpdate(orderNumber: string) {
    this.orderService.customerOrderStatusUpdate(this.accountService.getUserId(), orderNumber, 2).subscribe((result: any) => {
      if (result.status) {
        this.getUserOrdersListByUserId()
      }
      else {
        alert(result.message)
      }
    })
  }

  getProductDetailsByOrderNumberAndUserId(orderNumber: string) {
    this.orderService.getProductDetailsByOrderNumberAndUserId(orderNumber, this.accountService.getUserId()).subscribe((result: any) => {
      this.productDetailsList = result
      this.productDetailsList.forEach((item:any) => {
        this.totalOrderAmount += item.amountToBePaid
      });
    })
  }

}