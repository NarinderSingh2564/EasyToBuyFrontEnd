import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class OrderService {

  constructor(private http: HttpClient) { }

  placeOrder(customerId:number){
    return this.http.post("https://localhost:7239/api/Order/PlaceOrder?customerId=" + customerId, customerId)
  }

  getOrdersList(customerId: number, searchText: string, statusId:number, firstDate:any, secondDate:any){
    return this.http.get("https://localhost:7239/api/Order/GetOrdersList?customerId=" + customerId +"&searchText=" + searchText + "&statusId=" + statusId + "&firstDate=" + firstDate + "&secondDate=" + secondDate)
  }

  getUserOrdersListByUserId(userId:number,searchText: string, statusId:number){
    return this.http.get("https://localhost:7239/api/Order/GetUserOrdersListByUserId?userId=" + userId + "&searchText=" + searchText + "&statusId=" + statusId)
  }

  getProductDetailsByOrderNumberAndUserId(orderNumber:string, userId:number){
    return this.http.get("https://localhost:7239/api/Order/GetProductDetailsByOrderNumberAndUserId?orderNumber=" + orderNumber +"&userId=" + userId)
  }

  customerOrderStatusUpdate(userId:number, orderNumber:string, statusId:number){
    return this.http.get("https://localhost:7239/api/Order/CustomerOrderStatusUpdate?userId=" + userId + "&orderNumber=" + orderNumber + "&statusId=" + statusId)
  }

  getOrderStatusTrackingList(orderId:number, variationId: number){
    return this.http.get("https://localhost:7239/api/Order/GetOrderStatusTrackingList?orderNumber=" + orderId + "&variationId=" + variationId)
  }
}