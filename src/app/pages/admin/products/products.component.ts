import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  isSidePanelVisible: boolean = false;
  categoryList: any = [];
  productList: any = [];
  productWeightList : any =[];
  response: any = [];
  productForm: FormGroup;
  isFormValid: boolean = false;
  isEdit: boolean = false;
  userId: number = 0;

  ngOnInit(): void {
    this.getCategoryList();
    this.getProductList();
    this.getProductWeightList();
    this.productForm.controls['productPriceAfterDiscount'].disable();
    const activeUserData = JSON.parse(sessionStorage.getItem("session") || '""')
    this.userId = Object(activeUserData)["id"]
  }

  constructor(private productService: ProductService, private categoryServivce: CategoryService, private formBuilder: FormBuilder) {
    this.productForm = this.formBuilder.group({
      id: new FormControl(0),
      productSku: new FormControl("", [Validators.required]),
      productName: new FormControl("", [Validators.required]),
      productPrice: new FormControl(0, [Validators.required]),
      productDiscount: new FormControl(0, [Validators.required]),
      productPriceAfterDiscount: new FormControl(0),
      productShortName: new FormControl("", [Validators.required]),
      productDescription: new FormControl("", [Validators.required]),
      productTimeSpan: new FormControl("", [Validators.required]),
      categoryId: new FormControl(0, [Validators.required]),
      productWeightId: new FormControl(0, [Validators.required]),
      showProductWeight: new FormControl(false),
      productImageUrl: new FormControl("", [Validators.required]),
      isActive: new FormControl(false)
    })
  }
  
  get controls() {
    return this.productForm.controls
  }

  openSidePanel() {
    this.isSidePanelVisible = true
  }

  closeSidePanel() {
    this.isSidePanelVisible = false
  }

  addProduct() {
    this.isEdit = false
    this.productForm.reset()
    this.isFormValid = false
  }

  editProduct(product: any) {
    console.log(product)
    this.isEdit = true
    this.productForm.patchValue(product)
    this.openSidePanel()
  }

  getCategoryList() {
    this.categoryServivce.getCategoryList().subscribe(result => {
      this.categoryList = result
    })
  }

  getProductList() {
    this.productService.getProductsList().subscribe(result => {
      this.productList = result
    })
  }

  getProductWeightList(){
    this.productService.getProductWeightList().subscribe(result => {
      this.productWeightList = result
    })
  }

  calculatePriceAfterDiscount() {
    const productPriceAfterDiscount: any = this.productForm.value.productPrice - (this.productForm.value.productPrice * this.productForm.value.productDiscount / 100)
    this.productForm.controls['productPriceAfterDiscount'].patchValue(productPriceAfterDiscount)
    return productPriceAfterDiscount
  }
  ProductAddEdit() {
    this.isFormValid = true
    if (this.productForm.invalid) {
      return;
    }
    else {
      const product: any = {
        id: this.productForm.value.id != null && this.productForm.value.id > 0 ? this.productForm.value.id : 0,
        productSku: this.productForm.value.productSku,
        productName: this.productForm.value.productName,
        productPrice: this.productForm.value.productPrice,
        productDiscount: this.productForm.value.productDiscount,
        productPriceAfterDiscount: this.calculatePriceAfterDiscount(),
        productShortName: this.productForm.value.productShortName,
        productDescription: this.productForm.value.productDescription,
        productTimeSpan: this.productForm.value.productTimeSpan,
        categoryId: this.productForm.value.categoryId,
        productWeightId: this.productForm.value.productWeightId,
        showProductWeight:this.productForm.value.showProductWeight == null ? false : true, 
        productImageUrl: this.productForm.value.productImageUrl,
        createdBy: this.userId,
        updatedBy: this.userId,
        isActive: this.productForm.value.isActive == null ? false : true,
      }
      this.productService.productAddEdit(product).subscribe(result => {
        this.response = result;
        if (this.response.status) {
          alert(this.response.message);
          this.closeSidePanel();
          this.getProductList();
        }
      });
    }
  }

}


