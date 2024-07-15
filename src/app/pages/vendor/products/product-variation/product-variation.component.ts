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

  formBuilder = inject(FormBuilder)
  productService = inject(ProductService)
  accountService = inject(AccountService)

  variationForm: FormGroup;
  showChildComponent = new EventEmitter()

  productWeightList: any = [];
  productPackingList: any = [];
  isFormValid: boolean = false;

  constructor() {
    this.variationForm = this.formBuilder.group({
      id: new FormControl(0),
      productId: new FormControl(0, [Validators.required]),
      productPackingId: new FormControl(null, [Validators.required]),
      quantity: new FormControl("", [Validators.required]),
      productWeightId: new FormControl(null, [Validators.required]),
      mrp: new FormControl(null, [Validators.required]),
      discount: new FormControl(null, [Validators.required]),
      discountPrice: new FormControl(null, [Validators.required]),
      priceAfterDiscount: new FormControl(null, [Validators.required]),
      stockQuantity: new FormControl(null, [Validators.required]),
      showProductWeight: new FormControl(false),
      isActive: new FormControl(false),
    })
  }

  ngOnInit(): void {
    this.getProductWeightList()
    this.getProductPackingList()
    this.variationForm.controls['discountPrice'].disable();
    this.variationForm.controls['priceAfterDiscount'].disable();
    this.variationForm.controls['quantity'].disable();
    this.variationForm.patchValue(this.variationToEdit)
  }

  get controls() {
    return this.variationForm.controls;
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
    this.productService.getProductPackingList().subscribe(result => {
      this.productPackingList = result
    })
  }

  onChange(type: any) {
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

  calculateDiscountPrice() {
    const priceAfterDiscount: any = this.variationForm.value.mrp - (this.variationForm.value.mrp * this.variationForm.value.discount / 100)
    const discountPrice: any = this.variationForm.value.mrp - priceAfterDiscount
    this.variationForm.controls['priceAfterDiscount'].patchValue(priceAfterDiscount)
    this.variationForm.controls['discountPrice'].patchValue(discountPrice)
    return discountPrice
  }

  calculatePriceAfterDiscount() {
    const priceAfterDiscount: any = this.variationForm.value.mrp - (this.variationForm.value.mrp * this.variationForm.value.discount / 100)
    return priceAfterDiscount
  }

  variationAddEdit() {
    this.isFormValid = true
    if (this.variationForm.invalid) {
      return;
    }
    else {
      const variation: any = {
        id: this.variationForm.value.id != null && this.variationForm.value.id > 0 ? this.variationForm.value.id : 0,
        productId: this.activeProductId,
        productPackingId: Number(this.variationForm.value.productPackingId),
        quantity: this.variationForm.value.quantity == undefined ? 1 : this.variationForm.value.quantity,
        productWeightId: Number(this.variationForm.value.productWeightId),
        mrp: this.variationForm.value.mrp,
        discount: this.variationForm.value.discount,
        discountPrice: this.calculateDiscountPrice(),
        priceAfterDiscount: this.calculatePriceAfterDiscount(),
        stockQuantity: this.variationForm.value.stockQuantity,
        showProductWeight: this.variationForm.value.showProductWeight,
        isActive: this.variationForm.value.isActive,
        createdBy: this.accountService.getUserId(),
        updatedBy: this.accountService.getUserId(),
      }
      this.productService.productVariationAddEdit(variation).subscribe((result: any) => {
        alert(result.message)
        if (result.status) {
          this.isFormValid = false
        }
      })
    }
  }
}
