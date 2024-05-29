import { Component, inject } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CustomerAddressComponent } from '../customer-address/customer-address/customer-address.component';
import { EasyToBuyHelper } from '../../../helpers/EasyToBuyHelper';



@Component({
  selector: 'app-customer-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, CustomerAddressComponent],
  templateUrl: './customer-cart.component.html',
  styleUrl: './customer-cart.component.css'
})
export class CustomerCartComponent {

  userId: number = 0;
  router = inject(Router);
  cartService = inject(CartService)
  accountService = inject(AccountService)


  cartList: any = [];
  priceDetails: any = [];
  totalCartItems: number = 0;
  collapsed: boolean = true;
  days = 2;
  deliveryDate = new Date(Date.now() + this.days * 24 * 60 * 60 * 1000);
  deliveryAddress: any = []
  baseUrl:string = EasyToBuyHelper.imageBaseUrl;
  
  constructor() {
    this.getCartDetailsByCustomerId();
    this.getDeliveryAddress();
    this.cartService.updateCart$.subscribe(() => {
      this.getCartDetailsByCustomerId();
    })
    this.cartService.updateCartCount$.subscribe(() => {
      this.getCartDetailsByCustomerId();
    })
    this.accountService.updateDeliveryAddress$.subscribe(() => {
      this.getDeliveryAddress();
    })
    this.userId = this.accountService.getUserId();
  }

  showChild() {
    this.collapsed = !this.collapsed
  }

  getCartDetailsByCustomerId() {
    this.cartService.getCartDetailsByCustomerId(this.accountService.getUserId()).subscribe((result: any) => {
      this.cartList = result._cartListItems
      this.priceDetails = result.priceDetails
      this.totalCartItems = this.cartList.length
    })
  }

  getDeliveryAddress() {
    this.accountService.getAddressListByUserId().subscribe((result: any) => {
      this.deliveryAddress = result.filter((a: any) => a.isDeliveryAddress == true);
    })
  }

  decrement(item: any) {
    if (item.quantity > 1) {
      item.quantity--
      const cart = {
        userId: this.accountService.getUserId(),
        productId: item.productId,
        quantity: item.quantity,
        requestFrom: "Cart"
      }
      this.cartService.addToCart(cart).subscribe((result: any) => {
        this.getCartDetailsByCustomerId()
      })
    }
    else {
      alert("You must order atleast one quantity.")
    }
  }

  increment(item: any) {
    if (item.quantity < 5) {
      item.quantity++;
      const cart = {
        userId: this.accountService.getUserId(),
        productId: item.productId,
        quantity: item.quantity,
        requestFrom: "Cart"
      }
      this.cartService.addToCart(cart).subscribe((result: any) => {

        this.getCartDetailsByCustomerId()
      })
    }
    else {
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

  placeOrder() {
    if (this.deliveryAddress.length == 0) {
      alert("Set your delivery address to place order.")
    }
    else{
      this.router.navigate(['/place-order'])
    }
  }
}
