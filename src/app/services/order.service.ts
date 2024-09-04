import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class OrderService {

  constructor(private http: HttpClient) { }

  placeOrder(customerId:number){
    return this.http.post("https://localhost:7239/api/Order/PlaceOrder?customerId="+ customerId, customerId)
  }

  getOrdersList(customerId: number,userId: number, searchText: string, statusId:number, firstDate:any, secondDate:any){
    return this.http.get("https://localhost:7239/api/Order/GetOrdersList?customerId=" + customerId + "&userId="+ userId + "&searchText="+searchText + "&statusId=" + statusId+ "&firstDate="+firstDate + "&secondDate=" +secondDate)
  }

  getOrderStatusTrackingList(orderId:number){
    return this.http.get(" https://localhost:7239/api/Order/GetOrderStatusTrackingList?orderId=" + orderId)
  }
}
