import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) { }
   
  public updateCart$: Subject<boolean> = new Subject();
  public updateCartCount$: Subject<boolean> = new Subject();


  addToCart(objCart: any) {
    return this.http.post("https://localhost:7239/api/Cart/AddToCart", objCart)
  }

  getCartDetailsByCustomerId(id: number) {
    return this.http.get("https://localhost:7239/api/Cart/GetCartDetailsByCustomerId?customerId=" + id)
  }

  removeFromCart(id: number) {
    return this.http.post("https://localhost:7239/api/Cart/RemoveProductFromCart?id=" + id, id)
  }
}
