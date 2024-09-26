import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../../../services/account.service';
import { ProductService } from '../../../../services/product.service';

@Component({
  selector: 'app-product-images',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-images.component.html',
  styleUrl: './product-images.component.css',
  outputs: ['showChildComponent']
})
export class ProductImagesComponent implements OnInit {

  @Input() activeProductId: any;
  showChildComponent = new EventEmitter()
  variationImagesForm: FormGroup;

  formBuilder = inject(FormBuilder)
  productService = inject(ProductService)
  accountService = inject(AccountService)

  imageList: any = []
  ProductVariationList: any = []
  btnSubmit:boolean= false
  isFormValid: boolean = false
  imgCountAlert:boolean = false
  remainingImagesCount : number =0

  constructor() {
    this.variationImagesForm = this.formBuilder.group({
      variationId: new FormControl(null, [Validators.required]),
      images: new FormControl(null, [Validators.required]),
    })
  }

  ngOnInit(): void {
    this.getProductVariationListByProductId()
  }

  get controls() {
    return this.variationImagesForm.controls
  }

  disableChildComponent() {
    this.showChildComponent.emit(false)
  }

  getProductVariationListByProductId() {
    this.productService.getProductVariationListByProductId(this.activeProductId).subscribe((result: any) => {
      this.ProductVariationList = result
      this.ProductVariationList =  this.ProductVariationList.filter((t: { isActive: any; })=>t.isActive == 1)
    })
  }

  onVariationChange(event:any){
    this.productService.checkVariationImagesCountById(event.target.value).subscribe((result:any)=>{
      if(!result.status){
        alert(result.message)
      }
      else{
        this.remainingImagesCount = result.response
        this.imgCountAlert = true
      }
    })
  }

  selectedImages(event: any) {
    if(event.target.files.length > 3){
      alert("You can not upload more than 3 images.")
      this.variationImagesForm.controls['images'].reset();
    }
    else if(this.imgCountAlert && event.target.files.length > this.remainingImagesCount){
      alert("You can only add " + this.remainingImagesCount + " more images of this variation.")
      this.variationImagesForm.controls['images'].reset();
    }
    else{
      this.btnSubmit = true
      this.imageList = []
      for (var i = 0; i < event.target.files.length; i++) {
        this.imageList.push(event.target.files[i]);
      }
    }
  }   

  productVariationImagesUpload() {
    this.isFormValid = true
    if (this.variationImagesForm.invalid) {
      return;
    }
    else{
      const formData = new FormData();
      formData.set("variationId", this.variationImagesForm.value.variationId);
      formData.set("createdBy", this.accountService.getCustomerId());
      for (var i = 0; i < this.imageList.length; i++) {
        formData.append("images", this.imageList[i]);
      }
      this.productService.productVariationImagesAdd(formData).subscribe((result:any)=>{
        alert(result.message)
        if (result.status) {
          this.isFormValid = false
          this.variationImagesForm.reset();
        }
      })
    }
  }

}
