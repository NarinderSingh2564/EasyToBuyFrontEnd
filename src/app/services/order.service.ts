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
}
