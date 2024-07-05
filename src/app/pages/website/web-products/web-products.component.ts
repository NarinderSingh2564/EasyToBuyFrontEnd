import { Component, inject } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { CategoryService } from '../../../services/category.service';
import { CartService } from '../../../services/cart.service';
import { EasyToBuyHelper } from '../../../helpers/EasyToBuyHelper';

@Component({
  selector: 'app-web-products',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './web-products.component.html',
  styleUrl: './web-products.component.css'
})
export class WebProductsComponent {

  router = inject(Router);
  productService = inject(ProductService)
  accountService = inject(AccountService)
  categoryService = inject(CategoryService)
  cartService = inject(CartService)

  productList: any = [];
  activeCategoryId: number = 0;
  activeVariationId: number = 0;
  productIdDec:string = "";
  searchText: string = "";
  baseUrl:string = EasyToBuyHelper.imageBaseUrl;
  
  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe((result: any) => {
      this.activeCategoryId = (result.id) ? result.id : 0;
      this.activeVariationId = result.VariationId;
      this.searchText = (result.searchText)?result.searchText:"";
      this.getProductList();
    })
  }

  getProductList() {
    this.productService.getProductList(this.activeCategoryId,this.searchText,0,"Customer").subscribe(result => {
      this.productList = result
    })
  }

  increment(product: any) {
    if (!product.quantity) {
      product.quantity = 1;
    } if(product.quantity < 5) {
      product.quantity++;
    }
  }

  decrement(product: any) {
    if (product.quantity && product.quantity > 1) {
      product.quantity--;
    }
  }

  AddToCart(productId: number, productQuantity: number, variationId: number) {
    if (this.accountService.getUserId() > 0) {
        const cart = {
        userId: this.accountService.getUserId(),
        productId: productId,
        variationId: variationId,
        quantity: productQuantity,
        requestFrom:""
      }
      this.cartService.addToCart(cart).subscribe((result: any) => {
        alert(result.message)
        this.cartService.updateCart$?.next(true);
        this.cartService.updateCartCount$?.next(true);
      })
    }
    else {
      alert("Login to add products to cart")
    }
  }

  AddToWishList() {
    if (this.accountService.getUserId() > 0) {
      alert("add to wishlist")
    }
    else {
      alert("Login to add products to wishlist")
    }
  }
}

