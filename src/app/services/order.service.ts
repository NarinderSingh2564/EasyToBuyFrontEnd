import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class OrderService {

  constructor(private http: HttpClient) { }

  placeOrder(userId:number){
    return this.http.post("https://localhost:7239/api/Order/PlaceOrder?userId="+ userId, userId)
  }

  getOrderList(customerId: number, vendorId: number, searchText: string, statusId:number, firstDate:any, secondDate:any){
    return this.http.get("https://localhost:7239/api/Order/GetOrdersList?vendorId=" + vendorId + "&customerId="+customerId + "&searchText="+searchText + "&statusId=" + statusId+ "&firstDate="+firstDate + "&secondDate=" +secondDate)
  }

  getOrderStatusTrackingList(orderId:number){
    return this.http.get(" https://localhost:7239/api/Order/GetOrderStatusTrackingList?orderId=" + orderId)
  }
}
