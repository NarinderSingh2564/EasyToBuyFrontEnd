import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../../../services/account.service';
import { ProductService } from '../../../../services/product.service';

@Component({
  selector: 'app-product-specification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-specification.component.html',
  styleUrl: './product-specification.component.css',
  outputs: ['showChildComponent']
})

export class ProductSpecificationComponent implements OnInit {

  @Input() specificationToEdit: any;
  @Input() activeProductId: any;

  showChildComponent = new EventEmitter()

  specificationForm: FormGroup;

  formBuilder = inject(FormBuilder)
  productService = inject(ProductService)
  accountService = inject(AccountService)

  isFormValid: boolean = false

  constructor() {
    this.specificationForm = this.formBuilder.group({
      id: new FormControl(0),
      speciality: new FormControl(null, [Validators.required,Validators.max(20)]),
      manufacturer: new FormControl(null, [Validators.required]),
      ingredientType: new FormControl(null, [Validators.required]),
      shelfLife: new FormControl(null, [Validators.required]),
      ingredients: new FormControl(null, [Validators.required]),
      benefits: new FormControl(null, [Validators.required]),
      isActive: new FormControl(false),
    })
  }
  
  ngOnInit(): void {
    this.specificationForm.patchValue(this.specificationToEdit)
  }

  get controls() {
    return this.specificationForm.controls
  }

  disableChildComponent() {
    this.showChildComponent.emit(false)
  }
  
  specificationAddEdit() {
    this.isFormValid = true
    if (this.specificationForm.invalid) {
      return;
    }
    else {
      const specification = {
        id: this.specificationForm.value.id != null && this.specificationForm.value.id > 0 ? this.specificationForm.value.id : 0,
        productId: this.activeProductId,
        speciality: this.specificationForm.value.speciality,
        manufacturer: this.specificationForm.value.manufacturer,
        ingredientType: this.specificationForm.value.ingredientType,
        shelfLife: this.specificationForm.value.shelfLife,
        ingredients: this.specificationForm.value.ingredients,
        benefits: this.specificationForm.value.benefits,
        createdBy: this.accountService.getCustomerId(),
        updatedBy: this.accountService.getCustomerId(),
        isActive: this.specificationForm.value.isActive
      }
      this.productService.productSpecificationAddEdit(specification).subscribe((result: any) => {
        alert(result.message)
        if (result.status) {
          this.isFormValid = false
          document.getElementById("btnModalClose")?.click();
        }
      })
    }
  }

}
