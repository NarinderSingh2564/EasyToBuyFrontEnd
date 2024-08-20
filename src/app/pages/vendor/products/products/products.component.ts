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
  variationImgBaseUrl: string = EasyToBuyHelper.imageVariationBaseUrl;
  productRealImage: File | any = null;
  categoryList: any = [];
  productList: any = [];
  productVariationList: any = [];
  variationImagesList: any = []
  productSpecificationList: any = [];
  variationDetails: any = []
  productImageName: string = '';
  packingModeId: number = 0
  btnText: string = '';
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
      totalVolume: new FormControl(null, [Validators.required]),
      packingMode: new FormControl({ value: '', disabled: true, }),
      packingModeId: new FormControl(0),
      isActive: new FormControl(false)
    })
  }

  ngOnInit(): void {
    this.getProductList();
  }

  get controls() {
    return this.productForm.controls
  }

  clearControls() {
    this.productForm.controls['id'].patchValue(0);
    this.productForm.reset()
    this.productForm.controls['categoryId'].enable()
    // this.isFormValid = false
    // this.showSubCards = false
    // this.previewImage = ''
    // this.productImageName = ''
    // this.packingModeId = 0
  }

  closeProductForm() {
    this.showForm = false
    this.getProductList()
  }

  addProduct() {
    this.showForm = true
    this.isEdit = false
    this.showSubCards = false
    this.productForm.reset()
    this.isFormValid = false
    this.previewImage = ''
    this.productImageName = ''
    this.getCategoryList();
    this.productForm.controls['categoryId'].enable()
  }

  editProduct(product: any) {
    this.activeProductId = product.id
    this.showForm = true
    this.showSubCards = true
    this.isEdit = true
    this.productForm.patchValue(product)
    this.previewImage = EasyToBuyHelper.imageBaseUrl + product.productImage;
    this.productImageName = product.productImage;
    this.packingModeId = product.packingModeId
    this.getCategoryList();
    this.getProductVariationList();
    this.getVariationImagesList();
    this.getProductSpecificationList();
    this.productForm.controls['categoryId'].disable()
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

  onCategoryChange(event: any) {
    this.productForm.controls['packingMode'].patchValue(this.categoryList.filter((t: { id: any; }) => t.id == event.target.value)[0].packingMode)
    this.productForm.controls['packingModeId'].patchValue(this.categoryList.filter((t: { id: any; }) => t.id == event.target.value)[0].packingModeId)
    this.packingModeId = this.categoryList.filter((t: { id: any; }) => t.id == event.target.value)[0].packingModeId
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
      formData.set("productImage", this.productRealImage);
      formData.set("productImageName", this.productImageName);
      formData.set("categoryId", this.productForm.value.categoryId == undefined ? this.productForm.controls['categoryId'].value : this.productForm.value.categoryId);
      formData.set("totalVolume", this.productForm.value.totalVolume);
      formData.set("packingModeId", this.productForm.value.packingModeId);
      formData.set("createdBy", this.accountService.getUserId());
      formData.set("updatedBy", this.accountService.getUserId());
      formData.set("isActive", this.productForm.value.isActive == null ? "false" : "true");

      formData.forEach(entries => console.log(entries));

      this.productService.productAddEdit(formData).subscribe((result: any) => {
        if (result.status) {
          alert(result.message);
          this.isFormValid = false;
          if (!this.showSubCards) {
            this.showForm = false
          }
          this.getProductList()
        }
      });
    }
  }

  showAddEditModal() {
    this.showModal = true;
  }

  getValueFromChild(event: any) {
    this.showModal = event
    this.getProductVariationList()
    this.getVariationImagesList()
    this.getProductSpecificationList()
  }

  getProductVariationList() {
    this.productService.getProductVariationListById(this.activeProductId).subscribe((result: any) => {
      this.productVariationList = result.filter((t: { isDeleted: any }) => t.isDeleted == false)
    })
  }

  setShowProductWeight(variationId: number, showProductWeight: boolean) {
    this.productService.setShowProductWeight(variationId, showProductWeight).subscribe((result: any) => {
      if (result.status) {
        this.getProductVariationList()
      }
    })
  }

  setVariationIsActive(variationId: number, isActive: boolean) {
    this.productService.setVariationIsActive(variationId, isActive).subscribe((result: any) => {
      if (result.status) {
        this.getProductVariationList()
      }
    })
  }

  deleteProductVariation(variationId: number) {
    var confirmDelete = confirm("Are you sure to delete this variation?")
    if (confirmDelete) {
      this.productService.deleteProductVariation(variationId).subscribe((result: any) => {
        if (result.status) {
          this.getProductVariationList()
        }
        else {
          alert(result.message)
        }
      })
    }
  }

  variationAdd() {
    this.variationDetails = []
  }

  variationEdit(variation: any) {
    this.variationDetails = variation
  }

  setAsDefaultVariation(variationId: number, status: boolean) {
    this.productService.setDefaultVariation(this.activeProductId, variationId, status).subscribe((result: any) => {
      if (!result.status) {
        alert(result.message)
      }
      this.getProductVariationList()
    })
  }

  getVariationImagesList() {
    this.productService.getVariationImagesListByProductId(this.activeProductId).subscribe((result: any) => {
      this.variationImagesList = result
    })
  }

  deleteImage(imageId: number) {
    var confirmDelete = confirm("Are you sure to delete this image?");
    if (confirmDelete) {
      this.productService.deleteProductVariationImage(imageId).subscribe((result: any) => {
        alert(result.message)
        if (result.status) {
          this.getVariationImagesList();
        }
      })
    }
  }

  getProductSpecificationList() {
    this.productService.getProductSpecificationById(this.activeProductId).subscribe(result => {
      this.productSpecificationList = result
      if (this.productSpecificationList != null) {
        this.btnText = "Update Specification"
      }
      else {
        this.btnText = "Add Specification"
      }
    })
  }

}