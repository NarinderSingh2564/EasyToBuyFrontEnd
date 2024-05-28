import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { CartService } from '../services/cart.service';

export const customerAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const accountService = inject(AccountService)
  if (sessionStorage.getItem('UserSessionDetails') != null && accountService.getUserRole() == "Customer") {
    return true;
  }
  else {
    router.navigate(['/customer-login'])
    return false;
  }
};

export const placeOrderAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const accountService = inject(AccountService);
  const cartService = inject(CartService);
  var cartCount = 0
  cartService.getCartDetailsByCustomerId(accountService.getUserId()).subscribe((result: any) => {
    cartCount = result.length
  })
  if (sessionStorage.getItem('UserSessionDetails') != null && accountService.getUserRole() == "Customer" && cartCount > 0) {
    return true;
  }
  else {
    router.navigate(['/AllProducts'])
    return false;
  }
};