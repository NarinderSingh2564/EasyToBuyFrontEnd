import { Component, Input, inject } from '@angular/core';
import { AccountService } from '../../../../services/account.service';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CommonModule } from '@angular/common';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer-address',
  standalone: true,
  imports: [CarouselModule, CommonModule, ReactiveFormsModule],
  templateUrl: './customer-address.component.html',
  styleUrl: './customer-address.component.css',
})
export class CustomerAddressComponent {

  accountService = inject(AccountService);
  formBuilder = inject(FormBuilder);

  @Input() CustomerID: any;

  addressForm: FormGroup;
  userAddressList: any;
  addressTypeList: any = []
  address: any = []
  isFormValid: boolean = false
  modalHeader: string = "";
  disableButton: boolean = false;
  deliveryAddress: any = [];

  constructor() {
    this.getAddressList();
    this.getAddressTypeList();

    this.addressForm = this.formBuilder.group({
      id: new FormControl(0),
      pincode: new FormControl("", [Validators.required]),
      state: new FormControl(""),
      city: new FormControl(""),
      country: new FormControl("",),
      fullAddress: new FormControl("", [Validators.required]),
      addressTypeId: new FormControl("", [Validators.required]),
    })
  }

  get controls() {
    return this.addressForm.controls;
  }

  getAddressList() {
    this.accountService.getAddressListByCustomerId().subscribe((result: any) => {
      this.userAddressList = result;
    })
  }

  getAddressTypeList() {
    this.accountService.getAddressTypeList().subscribe((result: any) => {
      this.addressTypeList = result;
    })
  }

  getAddressByPincode(pincode: string) {
    this.accountService.getAddressByPincode(pincode).subscribe((result: any) => {
      if (result[0].Status == "Success") {
        this.disableButton = false
        this.address = result[0].PostOffice[0]
        this.addressForm.controls['state'].patchValue(this.address.State);
        this.addressForm.controls['city'].patchValue(this.address.Division);
        this.addressForm.controls['country'].patchValue(this.address.Country);
      }
      else {
        alert("This pincode does not exists, please enter correct pincode.")
        this.disableButton = true
      }
    })
  }

  addressAddEdit() {
    this.isFormValid = true
    if (this.addressForm.invalid) {
      return;
    }
    else {
      const addressData: any = {
        id: this.addressForm.value.id != null && this.addressForm.value.id > 0 ? this.addressForm.value.id : 0,
        customerId: this.accountService.getCustomerId(),
        pincode: this.addressForm.value.pincode,
        state: this.address.State,
        city: this.address.Division,
        country: this.address.Country,
        fullAddress: this.addressForm.value.fullAddress,
        addressTypeId: this.addressForm.value.addressTypeId,
        createdBy: this.accountService.getCustomerId(),
        updatedBy: this.accountService.getCustomerId(),
      }
      this.accountService.addressAddEdit(addressData).subscribe((result: any) => {
        alert(result.message)
        this.isFormValid = false
        this.addressForm.reset()
        this.getAddressList()
      })
    }
  }
  addAdressModal() {
    this.isFormValid = false
    this.modalHeader = "Add Address"
    this.addressForm.reset()
  }

  editAdressModal(address: any) {
    this.isFormValid = false;
    this.modalHeader = "Edit Address"
    this.addressForm.patchValue(address)
  }

  setDeliveryAddress(status: boolean, addressId: number) {
    if(status){
      var isConfirm = confirm("Are you sure to set this address as delivery address?");
      if (isConfirm) {
        this.accountService.setDeliveryAddress(addressId, this.accountService.getCustomerId()).subscribe((result: any) => {
          this.getAddressList();
          this.accountService.updateDeliveryAddress$.next(true);
        })
      }
    }
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    autoWidth: true,
    navText: ['<i class="bi bi-arrow-left"></i>', '<i class="bi bi-arrow-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 3
      }
    },
    nav: true
  }

}
