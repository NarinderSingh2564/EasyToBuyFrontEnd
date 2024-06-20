
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
  imports: [CommonModule, RouterLink],
  templateUrl: './product-description.component.html',
  styleUrl: './product-description.component.css'
})

export class ProductDescriptionComponent {

  router = inject(Router);
  ActiveProductId: number = 0;
  ProductDescription: any = [];
  buttonText: string = "Add To Cart"
  ProductVariationList: any = [];
  ProductSpecification: any = [];
  ProductVariationImage: any = [];

  accountService = inject(AccountService)
  cartService = inject(CartService)
  baseUrl: string = EasyToBuyHelper.imageBaseUrl;
  variationImageBaseUrl: string = EasyToBuyHelper.imageVariationBaseUrl;
  selectedImage: any;
  mainImage: any
  variationObj:any
  defaultVariationId:number=0
  defaultVariation: boolean = false;

  onThumbClick(image: any, id: number) {
    if (id == 1) {
      this.selectedImage = this.variationImageBaseUrl + image;
      console.log(this.selectedImage)
    }
    else {
      this.selectedImage = this.baseUrl + image;
    }
  }

  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService) {
    this.activatedRoute.params.subscribe((result: any) => {
      this.ActiveProductId = result.id
    })
    this.getProductDescription()
    this.getProductVariationList()
    this.getProductSpecification()
    // this.getProductVariationImage()
    
    if (this.accountService.getUserId() > 0) {
      this.cartService.CheckProductInCart(this.ActiveProductId, this.accountService.getUserId()).subscribe((result: any) => {
        if (result.status) {
          this.buttonText = "Go To Cart"
        }
        else {
          this.buttonText = "Add To Cart"
        }
      })
    }
  }

  getProductDescription() {
    this.productService.getProductDescriptionById(this.ActiveProductId).subscribe((result) => {
      this.ProductDescription = result
      this.mainImage = this.ProductDescription['0']
      this.selectedImage = this.baseUrl + this.mainImage['productImage']
    })

  }

  getProductVariationList() {
    this.productService.getProductVariationListById(this.ActiveProductId).subscribe(result => {
      this.ProductVariationList = result
      this.variationObj =  this.ProductVariationList.filter((t: { setAsDefault: any; })=>t.setAsDefault ==1)[0];
      this.defaultVariationId = this.variationObj['id']

      console.log(this.defaultVariationId)

    })
  }


  getProductSpecification() {
    this.productService.getProductSpecificationById(this.ActiveProductId).subscribe(result => {
      this.ProductSpecification = result
    })
  }

  // getProductVariationImage() {
  //   this.productService.getProductVariationImageById(this.ActiveProductId).subscribe(result => {
  //     this.ProductVariationImage = result
  //   })
  // }

  setDefaultVariation(variationId: number) {
    this.productService.setDefaultVariation(this.ActiveProductId, variationId).subscribe((result: any) => {
      if (result.status) {
        this.defaultVariation = true
        this.getProductDescription()
        // this.productService.getProductVariationImageById(variationId).subscribe(result => {
        //   this.ProductVariationImage = result
        // })
      }
    })
  }
  AddToCart(productId: number) {
    if (this.accountService.getUserId() > 0) {
      const cart = {
        userId: this.accountService.getUserId(),
        productId: productId,
        quantity: 1,
        requestFrom: ""
      }
      this.cartService.addToCart(cart).subscribe((result: any) => {
        if (result.status) {
          alert(result.message)
        }
        this.buttonText = "Go To Cart"
        if (!result.status) {
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
