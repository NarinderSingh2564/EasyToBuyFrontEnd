import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';
import { CategoryService } from '../../../services/category.service';
import { CartService } from '../../../services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, FormsModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

  router = inject(Router);
  productService = inject(ProductService)
  categoryService = inject(CategoryService)
  accountService = inject(AccountService)
  cartService = inject(CartService)

  categoryList: any = [];

  loggedIn: boolean = false;
  userName: string = this.accountService.getUserName();
  totalCartItems: number = 0

  constructor() {
    this.getCategoryList()
    if (this.accountService.getUserId() > 0) {
      this.loggedIn = true
      this.getCartDetailsByCustomerId()
    }
    this.cartService.updateCartCount$.subscribe(() => {
      this.getCartDetailsByCustomerId();
    })
  }

  SearchProducts(SearchText:string) {
    this.router.navigate(['/ProductsByCategory', 0,SearchText])
  }


  getCategoryList() {
    this.categoryService.getCategoryList().subscribe(result => {
      this.categoryList = result
    })
  }

  getProductByCategory(id: number) {
    this.router.navigate(['/ProductsByCategory', id,""])
  }

  getCartDetailsByCustomerId() {
    this.cartService.getCartDetailsByCustomerId(this.accountService.getUserId()).subscribe((result: any) => {
      this.totalCartItems = result._cartListItems.length
    })
  }
  Login() {
    this.router.navigate(['/customer-login']);
  }

  VendorLogin() {
    this.router.navigate(['/vendor-login']);
  }

  Logout() {
    sessionStorage.clear()
    this.router.navigate(['/AllProducts'])
  .then(() => {
    window.location.reload();
  });
    // window.location.reload();
    // this.router.navigate(['/AllProducts']);

  }

}
