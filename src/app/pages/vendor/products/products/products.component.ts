import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { CategoryService } from '../../../../services/category.service';
import { AccountService } from '../../../../services/account.service';
import { File } from 'buffer';
import { EasyToBuyHelper } from '../../../../helpers/EasyToBuyHelper';
import { ProductImagesComponent } from '../product-images/product-images.component';
import { ProductSpecificationComponent } from '../product-specification/product-specification.component';
import { ProductVariationComponent } from '../product-variation/product-variation.component';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule, ProductImagesComponent, ProductSpecificationComponent, ProductVariationComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})

export class ProductsComponent implements OnInit {

  productForm: FormGroup;
  baseUrl: string = EasyToBuyHelper.imageBaseUrl;
  variationImgBaseUrl :string = EasyToBuyHelper.imageVariationBaseUrl;
  productRealImage: File | any = null;
  categoryList: any = [];
  productList: any = [];
  productVariationList: any = [];
  variationImagesList:any=[]
  productSpecificationList: any = [];
  previews: string[] = [];
  variationDetails: any = []
  productImageName: string = '';
  btnText:string='Add Specification';
  activeProductId: number = 0;
  isFormValid: boolean = false;
  isEdit: boolean = false;
  previewImage: any = null;
  showForm: boolean = false
  showSubCards: boolean = false
  showModal: boolean = false;

  constructor(private productService: ProductService, private categoryServivce: CategoryService, private accountService: AccountService, private formBuilder: FormBuilder) {
    this.productForm = this.formBuilder.group({
      id: new FormControl(0),
      productName: new FormControl("", [Validators.required]),
      productDescription: new FormControl("", [Validators.required]),
      productImage: new FormControl(File, [Validators.required]),
      categoryId: new FormControl(null, [Validators.required]),
      isActive: new FormControl(false)
    })
  }
  
  ngOnInit(): void {
    this.getProductList();
  }

  get controls() {
    return this.productForm.controls
  }

  closeProductForm() {
    this.showForm = false
    this.getProductList()
  }

  addProduct() {
    this.showForm = true
    this.isEdit = false
    this.productForm.reset()
    this.isFormValid = false
    this.previewImage = ''
    this.getCategoryList();
  }

  editProduct(product: any) {
    this.activeProductId = product.id
    this.showForm = true
    this.showSubCards = true
    this.isEdit = true
    this.productForm.patchValue(product)
    this.previewImage = EasyToBuyHelper.imageBaseUrl + product.productImage;
    this.productImageName = product.productImage;
    this.getCategoryList();
    this.getProductVariationList();
    this.getVariationImagesList();
    this.getProductSpecificationList();
  }

  getCategoryList() {
    this.categoryServivce.getCategoryList().subscribe((result: any) => {
      this.categoryList = result;
    })
  }

  getProductList() {
    this.productService.getProductList(0, "", this.accountService.getUserId(), "Vendor").subscribe(result => {
      this.productList = result
    })
  }

  uploadFile(event: any) {
    this.productRealImage = <File>event.target.files[0];
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const file: File | null = selectedFiles.item(0);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewImage = e.target.result;
        };
        reader.readAsDataURL(this.productRealImage);
        //  this.productImageName = this.productRealImage['name']
      }
    }
  }

  ProductAddEdit() {
    this.isFormValid = true
    if (this.productForm.invalid) {
      return;
    }
    else {
      const formData = new FormData();
      formData.set("id", this.productForm.value.id != null && this.productForm.value.id > 0 ? this.productForm.value.id : 0);
      formData.set("vendorId", this.accountService.getUserId());
      formData.set("productName", this.productForm.value.productName);
      formData.set("productDescription", this.productForm.value.productDescription);
      formData.set("ProductImage", this.productRealImage);
      formData.set("ProductImageName", this.productImageName);
      formData.set("categoryId", this.productForm.value.categoryId);
      formData.set("createdBy", this.accountService.getUserId());
      formData.set("updatedBy", this.accountService.getUserId());
      formData.set("isActive", this.productForm.value.isActive == null ? "false" : "true");
      
      formData.forEach(entries => console.log(entries));
      this.productService.productAddEdit(formData).subscribe((result: any) => {
        if (result.status) {
          alert(result.message);
        }
      });
    }
  }

  showVariationAddEditModal() {
    this.showModal = true;
  }

  getValueFromChild(event: any) {
    this.showModal = event
    this.getProductVariationList()
    this.getVariationImagesList()
    this.getProductSpecificationList()
  }

  getProductVariationList() {
    this.productService.getProductVariationListById(this.activeProductId).subscribe(result => {
      this.productVariationList = result
    })
  }

  variationAdd() {
    this.variationDetails = []
  }

  variationEdit(variation: any) {
    this.variationDetails = variation
  }

  setAsDefaultVariation(variationId: number) {
    this.productService.setDefaultVariation(this.activeProductId, variationId).subscribe((result: any) => {
      if (result.status) {
        alert(result.message)
        this.getProductVariationList()
      }
    })
  }

  getVariationImagesList(){
    this.productService.getVariationImagesListByProductId(this.activeProductId).subscribe((result:any)=>{
      this.variationImagesList = result
      console.log(this.variationImagesList)
    })
  }

  getProductSpecificationList(){
    this.productService.getProductSpecificationById(this.activeProductId).subscribe(result=>{
      this.productSpecificationList = result
      if(this.productSpecificationList.length > 0){
        this.btnText="Update Specification"
      }
    })
  }

}


