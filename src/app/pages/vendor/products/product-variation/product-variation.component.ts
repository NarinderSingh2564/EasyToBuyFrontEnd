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
  @Input() remainingVolume: any;
  @Input() packingMode: any;

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
    if (this.variationToEdit.length == (null || undefined)) {
      this.variationForm.patchValue(this.variationToEdit)
      this.variationForm.controls['productPackingId'].disable();
      this.variationForm.controls['productWeightId'].disable();
      this.variationForm.controls['stockQuantity'].disable();
    }
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

  key(e: any) {
    if (e.key == 'ArrowUp' || e.key == 'ArrowDown' || e.key == 'Backspace') {
      return true;
    }
    else {
      e.preventDefault();
      return false;
    }
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

  getWeightValue(id: number) {
    if (this.packingMode == 'kg') {
      return this.productWeightList.filter((t: { id: any }) => t.id == id)[0].productWeightValue
    }
    else {
      return 1;
    }
  }

  variationAddEdit() {
    this.isFormValid = true
    if (this.variationForm.invalid) {
      return;
    }
    else {
      if (this.variationForm.value.id == 0) {
        var variation: any = {
          id: this.variationForm.value.id,
          productId: this.activeProductId,
          productPackingId: Number(this.variationForm.controls['productPackingId'].value),
          quantity: this.variationForm.value.quantity == undefined ? 1 : this.variationForm.value.quantity,
          productWeightId: Number(this.variationForm.controls['productWeightId'].value),
          mrp: this.variationForm.value.mrp,
          discount: this.variationForm.value.discount,
          discountPrice: this.calculateDiscountPrice(),
          priceAfterDiscount: this.calculatePriceAfterDiscount(),
          stockQuantity: this.variationForm.controls['stockQuantity'].value,
          createdBy: this.accountService.getUserId(),
          updatedBy: this.accountService.getUserId(),
        }
      }
      else {
        var variation: any = {
          id: this.variationForm.value.id,
          mrp: this.variationForm.value.mrp,
          discount: this.variationForm.value.discount,
          discountPrice: this.calculateDiscountPrice(),
          priceAfterDiscount: this.calculatePriceAfterDiscount(),
        }
      }
      if (this.getWeightValue(variation.productWeightId) * variation.quantity * variation.stockQuantity > this.remainingVolume) {
        alert(this.remainingVolume > 0 ? "You can not add variation of more than " + this.remainingVolume + " " + this.packingMode : "You can not add more variations.")
      }
      else {
        this.productService.productVariationAddEdit(variation).subscribe((result: any) => {
          alert(result.message)
          if (result.status) {
            this.isFormValid = false
          }
        })
      }
    }
  }
}