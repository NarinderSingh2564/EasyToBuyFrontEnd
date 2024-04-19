import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';
import { CartService } from '../../../services/cart.service';

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
  buttonText:string = ""

  accountService = inject(AccountService)
  cartService = inject(CartService)
  

  selectedImage = 'assets/images/iphone15/1.jpeg';

  onThumbClick(index: string){
    this.selectedImage='assets/images/iphone15/'+index+'.jpeg';
  }

  constructor(private activatedRoute: ActivatedRoute,private productService:ProductService) {
    this.activatedRoute.params.subscribe((result: any) => {
       this.ActiveProductId= result.id
    })
    this.getProductDescription()
    this.cartService.CheckProductInCart(this.ActiveProductId,this.accountService.getCustomerId()).subscribe((result:any)=>{
      if(result.status){
        this.buttonText = "Go To Cart"
      }
      else{
        this.buttonText = "Add To Cart"
      }
    })
  }

  getProductDescription(){
    this.productService.getProductDescriptionByProductId(this.ActiveProductId).subscribe(result=>{
      this.ProductDescription = result
    })
    
  }

  AddToCart(productId: number){
    if(this.accountService.getCustomerId() > 0) {
        const cart = {
        customerId: this.accountService.getCustomerId(),
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





