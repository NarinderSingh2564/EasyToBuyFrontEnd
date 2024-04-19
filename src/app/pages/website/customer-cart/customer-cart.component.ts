import { Component, inject } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CustomerAddressComponent } from '../../customer/customer-address/customer-address/customer-address.component';



@Component({
  selector: 'app-customer-cart',
  standalone: true,
  imports: [CommonModule, RouterLink,CustomerAddressComponent],
  templateUrl: './customer-cart.component.html',
  styleUrl: './customer-cart.component.css'
})
export class CustomerCartComponent {

  userId : number = 0;
  router = inject(Router);
  cartService = inject(CartService)
  accountService = inject(AccountService)
  

  cartList: any = [];
  priceDetails: any = [];
  totalCartItems: number = 0;
  collapsed:boolean = true;
  days = 2;
  deliveryDate = new Date(Date.now() + this.days * 24 * 60 * 60 * 1000);
  
  constructor() {
    this.getCartDetailsByCustomerId();

    this.cartService.updateCart$.subscribe(() =>{
      this.getCartDetailsByCustomerId();
    })
    this.cartService.updateCartCount$.subscribe(()=>{
      this.getCartDetailsByCustomerId();

    })

    this.userId = this.accountService.getCustomerId();

  }

  getCartDetailsByCustomerId() {
    this.cartService.getCartDetailsByCustomerId(this.accountService.getCustomerId()).subscribe((result: any) => {
      this.cartList = result._cartListItems
      this.priceDetails = result.priceDetails
      this.totalCartItems = this.cartList.length
    })
  }

  decrement(item: any) {
    if(item.quantity > 1){
      item.quantity--
      const cart = {
        customerId: this.accountService.getCustomerId(),
        productId: item.productId,
        quantity: item.quantity
      }
      this.cartService.addToCart(cart).subscribe((result:any)=>{
        this.getCartDetailsByCustomerId()
      })
      
    }
    else{
      alert("You must order atleast one quantity.")
    }
  }

  increment(item: any) {
    if(item.quantity < 5){
      item.quantity++;
      const cart = {
        customerId: this.accountService.getCustomerId(),
        productId: item.productId,
        quantity: item.quantity
      }
      this.cartService.addToCart(cart).subscribe((result:any)=>{

        this.getCartDetailsByCustomerId()
      })
    }
    else{
      alert("You can not add more than 5 quantities.")
    }
  }

  removeProductFromCart(id: number) {
    this.cartService.removeFromCart(id).subscribe((result: any) => {
      alert(result.message)
      this.cartService.updateCart$.next(true);
      this.cartService.updateCartCount$.next(true);
    })
  }

  goToShop() {
    this.router.navigate(['/AllProducts'])
  }
}
