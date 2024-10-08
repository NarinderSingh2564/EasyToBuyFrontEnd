import { Component, EventEmitter, Input, OnInit, inject } from '@angular/core';
import { ProductService } from '../../../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../../../services/account.service';

@Component({
  selector: 'app-product-variation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-variation.component.html',
  styleUrl: './product-variation.component.css',
  outputs: ['showChildComponent']
})
export class ProductVariationComponent implements OnInit {

  @Input() variationToEdit: any;
  @Input() activeProductId: any;
  @Input() packingModeId: any;

  formBuilder = inject(FormBuilder)
  productService = inject(ProductService)
  accountService = inject(AccountService)

  variationForm: FormGroup;
  showChildComponent = new EventEmitter()

  productWeightList: any = [];
  productPackingList: any = [];
  isFormValid: boolean = false;
  productWeightValue: any

  constructor() {
    this.variationForm = this.formBuilder.group({
      id: new FormControl(0),
      productPackingId: new FormControl(null, [Validators.required]),
      quantity: new FormControl("", [Validators.required]),
      productWeightId: new FormControl(null, [Validators.required]),
      mrp: new FormControl(null, [Validators.required]),
      discount: new FormControl(null, [Validators.required]),
      discountPrice: new FormControl(null, [Validators.required]),
      priceAfterDiscount: new FormControl(null, [Validators.required]),
      stockQuantity: new FormControl(null, [Validators.required]),
      totalVolume: new FormControl({ value: '', disabled: true, }),
    })
  }

  ngOnInit(): void {
    this.getProductWeightList()
    this.getProductPackingList()
    this.variationForm.controls['discountPrice'].disable();
    this.variationForm.controls['priceAfterDiscount'].disable();
    this.variationForm.controls['quantity'].disable();
    if (this.variationToEdit.length == (null || undefined)) {
      this.variationForm.patchValue(this.variationToEdit)
      this.variationForm.controls['productPackingId'].disable();
      this.variationForm.controls['productWeightId'].disable();
      const totalVolume = (this.variationToEdit.quantity * this.variationToEdit.stockQuantity * (this.packingModeId == 1 ? this.variationToEdit.productWeightValue : 1)).toFixed(this.packingModeId == 1 ? 2 : 0)
      this.variationForm.controls['totalVolume'].patchValue(totalVolume)
    }
  }

  get controls() {
    return this.variationForm.controls;
  }


  a(event:any){
    if(event.key == "."){
      event.preventDefault();
    }
  }

  clearControls(){
    this.isFormValid = false
    this.variationForm.reset()
    this.variationForm.controls['productPackingId'].enable();
    this.variationForm.controls['productWeightId'].enable();
  }

  disableChildComponent() {
    this.showChildComponent.emit(false)
  }

  getProductWeightList() {
    this.productService.getProductWeightList().subscribe(result => {
      this.productWeightList = result
    })
  }

  getProductPackingList() {
    this.productService.getProductPackingList().subscribe((result: any) => {
      this.productPackingList = result.filter((t: { packingModeId: any }) => t.packingModeId == this.packingModeId)
    })
  }

  onPackingTypeChange(type: any) {
    if (type.target.value != "")
      if (type.target.value != 8) {
        this.variationForm.controls['quantity'].disable();
        this.variationForm.controls['quantity'].patchValue(1);
      }
      else {
        this.variationForm.controls['quantity'].reset();
        this.variationForm.controls['quantity'].enable();
      }
  }

  onProductWeightChange(event: any) {
    this.productWeightValue = this.productWeightList.filter((t: { id: any }) => t.id == event.target.value)[0].productWeightValue
  }

  calculateTotalVolume() {
    if(this.variationToEdit.length == 0){
      var totalVolume = (this.variationForm.controls['quantity'].value * this.variationForm.controls['stockQuantity'].value * (this.packingModeId == 1 ? this.productWeightValue : 1)).toFixed(this.packingModeId == 1 ? 2 : 0)
    }
    else{
      var totalVolume = (this.variationToEdit.quantity * this.variationForm.controls['stockQuantity'].value * (this.packingModeId == 1 ? this.variationToEdit.productWeightValue : 1)).toFixed(this.packingModeId == 1 ? 2 : 0)
    }
    this.variationForm.controls['totalVolume'].patchValue(totalVolume)
  }

  calculateDiscountPrice() {
    const priceAfterDiscount: any = Number((this.variationForm.value.mrp - (this.variationForm.value.mrp * this.variationForm.value.discount / 100))).toFixed(1)
    const discountPrice: any = Number(this.variationForm.value.mrp - priceAfterDiscount).toFixed(1)
    this.variationForm.controls['priceAfterDiscount'].patchValue(priceAfterDiscount)
    this.variationForm.controls['discountPrice'].patchValue(discountPrice)
    return discountPrice
  }

  calculatePriceAfterDiscount() {
    const priceAfterDiscount: any = Number(this.variationForm.value.mrp - (this.variationForm.value.mrp * this.variationForm.value.discount / 100)).toFixed(1)
    return priceAfterDiscount
  }

  variationAddEdit() {
    this.isFormValid = true
    if (this.variationForm.invalid) {
      return;
    }
    else {
      const variation: any = {
        id: this.variationForm.value.id == null ? 0 : this.variationForm.value.id,
        productId: this.activeProductId,
        productPackingId: Number(this.variationForm.controls['productPackingId'].value),
        quantity: this.variationForm.controls['quantity'].value,
        productWeightId: Number(this.variationForm.controls['productWeightId'].value),
        mrp: this.variationForm.value.mrp,
        discount: this.variationForm.value.discount,
        discountPrice: Number(this.calculateDiscountPrice()),
        priceAfterDiscount: Number(this.calculatePriceAfterDiscount()),
        stockQuantity: this.variationForm.controls['stockQuantity'].value,
        createdBy: this.accountService.getCustomerId(),
        updatedBy: this.accountService.getCustomerId(),
      }
      this.productService.productVariationAddEdit(variation).subscribe((result: any) => {
        alert(result.message)
        if (result.status) {
          this.isFormValid = false
          document.getElementById("btnModalClose")?.click();
        }
      })
    }
  }
  
}