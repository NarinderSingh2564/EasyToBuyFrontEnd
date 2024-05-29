import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';
import { CartService } from '../../../services/cart.service';
import { EasyToBuyHelper } from '../../../helpers/EasyToBuyHelper';

@Component({
  selector: 'app-product-description',
  standalone: true,
  imports:[CommonModule, RouterLink],
  templateUrl: './product-description.component.html',
  styleUrl: './product-description.component.css'
})

export class ProductDescriptionComponent {

  router = inject(Router);
  ActiveProductId:number = 0; 
  ProductDescription: any = [];
  buttonText:string = "Add To Cart"

  accountService = inject(AccountService)
  cartService = inject(CartService)
  baseUrl:string = EasyToBuyHelper.imageBaseUrl;


  selectedImage = 'assets/images/iphone15/1.jpeg';

  onThumbClick(index: string){
    this.selectedImage='assets/images/iphone15/'+index+'.jpeg';
  }

  constructor(private activatedRoute: ActivatedRoute,private productService:ProductService) {
    this.activatedRoute.params.subscribe((result: any) => {
      this.ActiveProductId= result.id
    })
    this.getProductDescription()
    if(this.accountService.getUserId()>0){
      this.cartService.CheckProductInCart(this.ActiveProductId,this.accountService.getUserId()).subscribe((result:any)=>{
        if(result.status){
          this.buttonText = "Go To Cart"
        }
        else{
          this.buttonText = "Add To Cart"
        }
      })
    }
  }

  getProductDescription(){
    this.productService.getProductDetailsById(this.ActiveProductId).subscribe(result=>{
      this.ProductDescription = result
    })
    
  }

  AddToCart(productId: number){
    if(this.accountService.getUserId() > 0) {
        const cart = {
        userId: this.accountService.getUserId(),
        productId: productId,
        quantity: 1,
        requestFrom:""
      }
      this.cartService.addToCart(cart).subscribe((result: any) => {
          if(result.status){
            alert(result.message)
          }      
          this.buttonText = "Go To Cart"
          if(!result.status){
            this.router.navigate(['/customer-cart']);
          }
          this.cartService.updateCart$?.next(true);
          this.cartService.updateCartCount$?.next(true);
      })
    }
    else {
      alert("Login to add products to cart")
    }
  }
  

}