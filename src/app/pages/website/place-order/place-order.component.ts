import { Component, inject } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-place-order',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './place-order.component.html',
  styleUrl: './place-order.component.css'
})
export class PlaceOrderComponent {

  cartService = inject(CartService)
  accountService = inject(AccountService)
  orderService = inject(OrderService)

  priceDetails: any = [];
  totalCartItems: number = 0;
  isPlaced: boolean = false;
  
  constructor() {
    this.getCartDetailsByCustomerId();
  }

  getCartDetailsByCustomerId() {
    this.cartService.getCartDetailsByCustomerId(this.accountService.getCustomerId()).subscribe((result: any) => {
      this.priceDetails = result.priceDetails
      this.totalCartItems = result._cartListItems.length
      console.log(this.priceDetails)
    })
  }

  placeOrder() {
    this.orderService.placeOrder(this.accountService.getCustomerId()).subscribe((result: any) => {
      if(result.status){
        this.isPlaced = true;
        this.cartService.getCartDetailsByCustomerId(this.accountService.getCustomerId())
        this.cartService.updateCartCount$?.next(true);
      }
      else{
        alert(result.message)
      }
    })
  }
}
