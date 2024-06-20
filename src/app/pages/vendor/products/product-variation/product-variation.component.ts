import { Component, inject } from '@angular/core';
import { ProductService } from '../../../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-variation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-variation.component.html',
  styleUrl: './product-variation.component.css'
})
export class ProductVariationComponent {

  productService = inject(ProductService)
  productWeightList:any=[];

  constructor(){
    this.getProductWeightList()
  }

  getProductWeightList() {
    this.productService.getProductWeightList().subscribe(result => {
      this.productWeightList = result
    })
  }
}
