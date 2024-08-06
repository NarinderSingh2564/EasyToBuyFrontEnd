import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';
import { CartService } from '../../../services/cart.service';
import { EasyToBuyHelper } from '../../../helpers/EasyToBuyHelper';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-product-description',
  standalone: true,
  imports: [CommonModule,CarouselModule ,RouterLink],
  templateUrl: './product-description.component.html',
  styleUrl: './product-description.component.css'
})

export class ProductDescriptionComponent {

  router = inject(Router);
  ActiveProductId: number = 0;
  ActiveVariationId:number = 0;
  ProductDescription: any;
  SliderItems: any;
  buttonText: string = "Add To Cart"
  ProductVariationList: any = [];
  ProductSpecification: any = [];
  ProductVariationImage: any = [];
  VariationDetail: any = [];
  selectedVariationId: any;
  selectedCategoryId : any;
  selectedProductId : any;
  checkId: number = 0;

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
    }
    else {
      this.selectedImage = this.baseUrl + image;
    }
  }

  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService) {
    this.activatedRoute.params.subscribe((result: any) => {
      this.ActiveProductId = result.id
      this.ActiveVariationId = result.variationId
      this.selectedVariationId = result.variationId
    })
    
      this.getProductDescription()
    this.getProductVariationList()
    this.getProductSpecification()
    this.getProductVariationImage()
    this.getSliderItems()
  }

  getProductDescription() {
    this.productService.getProductDescriptionById(this.ActiveProductId).subscribe((result:any) => {
      this.ProductDescription = result
      this.selectedCategoryId = this.ProductDescription.categoryId
      this.selectedProductId = this.ProductDescription.id
      this.mainImage = this.ProductDescription
      this.selectedImage = this.baseUrl + this.mainImage.productImage
      
      this.productService.getProductSliderItemsByCategoryId(this.selectedCategoryId,this.selectedProductId).subscribe(result => {
        this.SliderItems = result
      })
      
    })
  }

  getProductVariationList() {
    this.productService.getProductVariationListById(this.ActiveProductId).subscribe(result => {
      this.ProductVariationList = result
      this.ProductVariationList =  this.ProductVariationList.filter((t: { isActive: any; })=>t.isActive == 1)
      this.variationObj =  this.ProductVariationList.filter((t: { setAsDefault: any; })=>t.setAsDefault == 1)[0];
      this.defaultVariationId = this.variationObj['id']
      this.checkId = this.ProductVariationList.filter((t: { setAsDefault: any; })=>t.setAsDefault == 1)[0].id;
    })
  }

  getProductSpecification() {
    this.productService.getProductSpecificationById(this.ActiveProductId).subscribe(result => {
      this.ProductSpecification = result
    })
  }

  getProductVariationImage(){
    this.productService.getProductVariationImageById(this.ActiveVariationId).subscribe(result => {
      this.ProductVariationImage = result
    })
  }

  getVariationDetails(VariationDes: any){
    this.checkId = VariationDes.id;
      this.ProductDescription.priceAfterDiscount = VariationDes.priceAfterDiscount;
      this.ProductDescription.mrp = VariationDes.mrp;
      this.ProductDescription.discount= VariationDes.discount;
      this.selectedVariationId =  VariationDes.id;
  
      this.productService.getProductVariationImageById(VariationDes.id).subscribe(result => {
        this.ProductVariationImage = result
      })
  }
  
  AddToCart(productId: number, id: number) {
    if (this.accountService.getUserId() > 0) {
      const cart = {
        userId: this.accountService.getUserId(),
        productId: productId,
        variationId: id,
        quantity: 1,
        requestFrom: ""
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

  getSliderItems() {
    this.productService.getProductSliderItemsByCategoryId(this.selectedCategoryId,this.selectedProductId).subscribe(result => {
      this.SliderItems = result
    })
  }

  positinOptions: OwlOptions = {
    loop: true,
    autoplay: false,
    dots: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    navSpeed: 600,
    navText: ['<i class="fa fa-caret-left"></i>', '<i class="fa fa-caret-right"></i>'],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 4,
      },
      1000: {
        items: 5,
      }
    },
     nav: true,
  }

}
