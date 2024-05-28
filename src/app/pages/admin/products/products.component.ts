import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { AccountService } from '../../../services/account.service';
import { File } from 'buffer';
import { environmentHelper } from '../../../helpers/environmentHelper';


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
  productWeightList: any = [];
  response: any = [];
  productForm: FormGroup;
  isFormValid: boolean = false;
  isEdit: boolean = false;
  productRealImage: File | any = null;
  previewImage: any = null;
  productImageName: string = '';
  baseUrl:string = environmentHelper.imageBaseUrl;
  
  ngOnInit(): void {
    this.getProductList();
    this.productForm.controls['priceAfterDiscount'].disable();
  }

  constructor(private productService: ProductService, private categoryServivce: CategoryService, private accountService: AccountService, private formBuilder: FormBuilder) {
    this.productForm = this.formBuilder.group({
      id: new FormControl(0),
      productName: new FormControl("", [Validators.required]),
      mrp: new FormControl(0, [Validators.required]),
      discount: new FormControl(0, [Validators.required]),
      priceAfterDiscount: new FormControl(0),
      productDescription: new FormControl("", [Validators.required]),
      productImage: new FormControl(File, [Validators.required]),
      categoryId: new FormControl(0, [Validators.required]),
      productWeightId: new FormControl(0, [Validators.required]),
      showProductWeight: new FormControl(false),
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
    this.previewImage = ''
    this.getCategoryList();
    this.getProductWeightList();
  }

  editProduct(product: any) {
    this.isEdit = true
    this.productForm.patchValue(product)
    this.openSidePanel()
    this.previewImage = environmentHelper.imageBaseUrl+product.productImage;
    this.productImageName = product.productImage;
    this.getCategoryList();
    this.getProductWeightList();
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

  getProductWeightList() {
    this.productService.getProductWeightList().subscribe(result => {
      this.productWeightList = result
    })
  }

  calculatePriceAfterDiscount() {
    const priceAfterDiscount: any = this.productForm.value.mrp - (this.productForm.value.mrp * this.productForm.value.discount / 100)
    this.productForm.controls['priceAfterDiscount'].patchValue(priceAfterDiscount)
    return priceAfterDiscount
  }

  uploadFile(event: any) {

    this.productRealImage = <File>event.target.files[0];

    const selectedFiles = event.target.files;

    if (selectedFiles) {
      const file: File | null = selectedFiles.item(0);

      if (file) {


        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.previewImage = e.target.result;
        };

        reader.readAsDataURL(this.productRealImage);
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
      formData.set("mrp", this.productForm.value.mrp);
      formData.set("discount", this.productForm.value.discount);
      formData.set("priceAfterDiscount", this.calculatePriceAfterDiscount());
      formData.set("productDescription", this.productForm.value.productDescription);
      formData.set("ProductImage", this.productRealImage);
      formData.set("ProductImageName", this.productImageName);

      formData.set("categoryId", this.productForm.value.categoryId);
      formData.set("productWeightId", this.productForm.value.productWeightId);
      formData.set("createdBy", this.accountService.getUserId());
      formData.set("updatedBy", this.accountService.getUserId());
      formData.set("isActive", this.productForm.value.isActive == null ? "false" : "true");
      formData.set("showProductWeight", this.productForm.value.showProductWeight == null ? "false" : "true");



      // const product: any = {
      //   id: this.productForm.value.id != null && this.productForm.value.id > 0 ? this.productForm.value.id : 0,
      //   vendorId: this.accountService.getUserId(),
      //   productName: this.productForm.value.productName,
      //   mrp: this.productForm.value.mrp,
      //   discount: this.productForm.value.discount,
      //   priceAfterDiscount: this.calculatePriceAfterDiscount(),
      //   productDescription: this.productForm.value.productDescription,
      //   ProductImage: this.productRealImage,
      //   categoryId: this.productForm.value.categoryId,
      //   productWeightId: this.productForm.value.productWeightId,
      //   createdBy: this.accountService.getUserId(),
      //   updatedBy: this.accountService.getUserId(),
      //   isActive: this.productForm.value.isActive == null ? false : true,
      //   showProductWeight: this.productForm.value.showProductWeight == null ? false : true,
      // }
      this.productService.productAddEdit(formData).subscribe(result => {
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


