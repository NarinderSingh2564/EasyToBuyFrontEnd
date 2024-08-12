import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { VendorService } from '../../../services/vendor.service';
import { isDataView } from 'node:util/types';
import { HttpErrorResponse } from '@angular/common/http';
import { error } from 'node:console';

@Component({
  selector: 'app-vendor-register',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './vendor-register.component.html',
  styleUrl: './vendor-register.component.css'
})
export class VendorRegisterComponent {

  vendorBasicDetailsUIModel: FormGroup;
  vendorCompanyDetailsUIModel: FormGroup;
  vendorBankDetailsUIModel: FormGroup;

  address: any = [];
  vendorUIModel: any = {};
  showPwd: boolean = false;
  isFormValid: boolean = false;
  
  isAccountNumberConfirm: boolean = true

  constructor(private formBuilder: FormBuilder, private vendorService: VendorService) {
    this.vendorBasicDetailsUIModel = this.formBuilder.group({
      name: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z ]*$")]),
      email: new FormControl("", [Validators.required, Validators.email]),
      mobile: new FormControl("", [Validators.required, Validators.pattern("^[6,7,8,9][0-9]{0,9}$")]),
      password: new FormControl("", [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{4,}$")]),
      type: new FormControl("", [Validators.required]),
      identificationType: new FormControl("", [Validators.required]),
      identificationNumber: new FormControl("", [Validators.required]),
      pincode: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
      city: new FormControl({ value: '', disabled: true, }),
      state: new FormControl({ value: '', disabled: true, }),
      country: new FormControl({ value: '', disabled: true, }),
      fullAddress: new FormControl("", [Validators.required])
    })
    this.vendorCompanyDetailsUIModel = this.formBuilder.group({
      companyName: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z ]*$")]),
      description: new FormControl("", [Validators.required]),
      dealingPerson: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z ]*$")]),
      gstin: new FormControl("", [Validators.required]),
      pincode: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
      city: new FormControl({ value: '', disabled: true, }),
      state: new FormControl({ value: '', disabled: true, }),
      country: new FormControl({ value: '', disabled: true, }),
      fullAddress: new FormControl("", [Validators.required])
    })
    this.vendorBankDetailsUIModel = formBuilder.group({
      accountHolderName: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z ]*$")]),
      accountNumber: new FormControl("", [Validators.required]),
      confirmAccountNumber: new FormControl("", [Validators.required]),
      ifscCode: new FormControl("", [Validators.required]),
      bankName: new FormControl({ value: '', disabled: true, }),
      branch: new FormControl({ value: '', disabled: true, })
    })
  }

  get vendorFormControls() {
    return this.vendorBasicDetailsUIModel.controls;
  }

  get companyFormControls() {
    return this.vendorCompanyDetailsUIModel.controls;
  }

  get bankFormControls() {
    return this.vendorBankDetailsUIModel.controls;
  }

  showPassword() {
    this.showPwd = !this.showPwd
  }

  isNumberInput(event:any){
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getAddressByPincode(pincode: string, formName: string) {
    this.vendorService.getAddressByPincode(pincode).subscribe((result: any) => {
      if (result[0].Status == "Success") {
        this.address = result[0].PostOffice[0]
        if (formName == "vendorDetails") {
          this.vendorBasicDetailsUIModel.controls['state'].patchValue(this.address.State);
          this.vendorBasicDetailsUIModel.controls['city'].patchValue(this.address.Division);
          this.vendorBasicDetailsUIModel.controls['country'].patchValue(this.address.Country);
        }
        if (formName == "companyDetails") {
          this.vendorCompanyDetailsUIModel.controls['state'].patchValue(this.address.State);
          this.vendorCompanyDetailsUIModel.controls['city'].patchValue(this.address.Division);
          this.vendorCompanyDetailsUIModel.controls['country'].patchValue(this.address.Country);
        }
      }
      else {
        alert("This pincode does not exists, please enter correct pincode.")
        if(formName == "vendorDetails"){
          this.vendorBasicDetailsUIModel.controls['pincode'].reset()
        }
        if (formName == "companyDetails") {
          this.vendorCompanyDetailsUIModel.controls['pincode'].reset()
        }
      }
    })
  }

  validateAccountNumber() {
    this.isAccountNumberConfirm = this.vendorBankDetailsUIModel.value.accountNumber != this.vendorBankDetailsUIModel.value.confirmAccountNumber && this.vendorBankDetailsUIModel.value.confirmAccountNumber != '' ? false : true
  }
  
  getBankDetailsByIFSCCode(ifscCode: string) {
    this.vendorService.getBankDetailsByIFSCCode(ifscCode).subscribe((result: any) => {
      if (result != null) {
        this.vendorBankDetailsUIModel.controls['bankName'].patchValue(result.BANK);
        this.vendorBankDetailsUIModel.controls['branch'].patchValue(result.BRANCH);
      }
    },error=>{
      if(error.status == 404){
        alert("This IFSC code does not exists, please enter correct IFSC code.")
        this.vendorBankDetailsUIModel.controls['ifscCode'].reset()
      }
    });
  }

  vendorRegistration() {
    this.vendorUIModel = {};
    this.isFormValid = true
    if (this.vendorBasicDetailsUIModel.invalid || this.vendorCompanyDetailsUIModel.invalid || this.vendorBankDetailsUIModel.invalid) {
      return;
    }
    else {
      var vendorBasicDetailsUIModel: any = {
        name: this.vendorBasicDetailsUIModel.value.name.trim(),
        email: this.vendorBasicDetailsUIModel.value.email.trim(),
        mobile: this.vendorBasicDetailsUIModel.value.mobile.toString().trim(),
        password: this.vendorBasicDetailsUIModel.value.password.trim(),
        type: this.vendorBasicDetailsUIModel.value.type,
        identificationType: this.vendorBasicDetailsUIModel.value.identificationType,
        identificationNumber: this.vendorBasicDetailsUIModel.value.identificationNumber.trim(),
        pincode: this.vendorBasicDetailsUIModel.value.pincode.trim(),
        city: this.vendorBasicDetailsUIModel.getRawValue().city,
        state: this.vendorBasicDetailsUIModel.getRawValue().state,
        country: this.vendorBasicDetailsUIModel.getRawValue().country,
        fullAddress: this.vendorBasicDetailsUIModel.value.fullAddress.trim()
      }
      var vendorCompanyDetailsUIModel: any = {
        companyName: this.vendorCompanyDetailsUIModel.value.companyName.trim(),
        description: this.vendorCompanyDetailsUIModel.value.description.trim(),
        dealingPerson: this.vendorCompanyDetailsUIModel.value.dealingPerson.trim(),
        gstin: this.vendorCompanyDetailsUIModel.value.gstin.trim(),
        pincode: this.vendorCompanyDetailsUIModel.value.pincode.trim(),
        city: this.vendorCompanyDetailsUIModel.getRawValue().city,
        state: this.vendorCompanyDetailsUIModel.getRawValue().state,
        country: this.vendorCompanyDetailsUIModel.getRawValue().country,
        fullAddress: this.vendorCompanyDetailsUIModel.value.fullAddress.trim(),
      }
      var vendorBankDetailsUIModel: any = {
        accountHolderName: this.vendorBankDetailsUIModel.value.accountHolderName.trim(),
        accountNumber: this.vendorBankDetailsUIModel.value.accountNumber.trim(),
        ifscCode: this.vendorBankDetailsUIModel.value.ifscCode.trim(),
        bankName: this.vendorBankDetailsUIModel.getRawValue().bankName,
        branch: this.vendorBankDetailsUIModel.getRawValue().branch,
      }
      this.vendorUIModel = {
        vendorBasicDetailsUIModel: vendorBasicDetailsUIModel,
        vendorCompanyDetailsUIModel: vendorCompanyDetailsUIModel,
        vendorBankDetailsUIModel: vendorBankDetailsUIModel
      };
      this.vendorService.vendorRegistration(this.vendorUIModel).subscribe((result: any) => {
        alert(result.message)
        if (result.status) {
          this.vendorBasicDetailsUIModel.reset()
          this.vendorCompanyDetailsUIModel.reset()
          this.vendorBankDetailsUIModel.reset()
          this.isFormValid = false
        }
      })
    }
  }

}
