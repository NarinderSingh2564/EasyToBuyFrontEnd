import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-vendor-register',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './vendor-register.component.html',
  styleUrl: './vendor-register.component.css'
})
export class VendorRegisterComponent {

  userBasicDetailsUIModel: FormGroup;
  userCompanyDetailsUIModel: FormGroup;
  userBankDetailsUIModel: FormGroup;

  address: any = [];
  userUIModel: any = {};
  showPwd: boolean = false;
  isFormValid: boolean = false;
  showCompanyCard: boolean = true;
  isAccountNumberConfirm: boolean = true

  constructor(private formBuilder: FormBuilder, private userService: UserService) {
    this.userBasicDetailsUIModel = this.formBuilder.group({
      name: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z ]*$")]),
      email: new FormControl("", [Validators.required, Validators.pattern("^[A-Za-z0-9._]{3,}@[A-Za-z]{3,}[.]{1}[a-zA-Z]{2,6}$")]),
      mobile: new FormControl("", [Validators.required, Validators.pattern("^[6,7,8,9]{1}[0-9]{9}$")]),
      password: new FormControl("", [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{4,}$")]),
      role: new FormControl("", [Validators.required]),
      identificationType: new FormControl("", [Validators.required]),
      identificationNumber: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z0-9- ]+$")]),
      pincode: new FormControl("", [Validators.required, Validators.pattern("^[1-9][0-9]{5}$")]),
      city: new FormControl({ value: '', disabled: true, }),
      state: new FormControl({ value: '', disabled: true, }),
      country: new FormControl({ value: '', disabled: true, }),
      fullAddress: new FormControl("", [Validators.required, Validators.pattern("^['-A-Za-z0-9()@./#& ]*$")])
    })
    this.userCompanyDetailsUIModel = this.formBuilder.group({
      companyName: new FormControl("", [Validators.required, Validators.pattern("^['-A-Za-z0-9()& ]*$")]),
      description: new FormControl("", [Validators.required, Validators.pattern("^['-A-Za-z0-9()@./#& ]*$")]),
      dealingPerson: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z ]*$")]),
      gstin: new FormControl("", [Validators.required, Validators.pattern("^[0-9]{2}[A-Za-z0-9]{10}[0-9]{1}[Zz]{1}[A-Zz-z0-9]{1}$")]),
      pincode: new FormControl("", [Validators.required, Validators.pattern("^[1-9][0-9]{5}$")]),
      city: new FormControl({ value: '', disabled: true, }),
      state: new FormControl({ value: '', disabled: true, }),
      country: new FormControl({ value: '', disabled: true, }),
      fullAddress: new FormControl("", [Validators.required, Validators.pattern("^['-A-Za-z0-9()@./#& ]*$")])
    })
    this.userBankDetailsUIModel = formBuilder.group({
      accountHolderName: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z ]*$")]),
      accountNumber: new FormControl("", [Validators.required, Validators.pattern("^[0-9]{9,18}$")]),
      confirmAccountNumber: new FormControl("", [Validators.required]),
      ifscCode: new FormControl("", [Validators.required, Validators.pattern("^[A-Za-z]{4}0[a-zA-Z0-9]{6}$")]),
      bankName: new FormControl({ value: '', disabled: true, }),
      branch: new FormControl({ value: '', disabled: true, })
    })
  }

  get userFormControls() {
    return this.userBasicDetailsUIModel.controls;
  }

  get companyFormControls() {
    return this.userCompanyDetailsUIModel.controls;
  }

  get bankFormControls() {
    return this.userBankDetailsUIModel.controls;
  }

  showPassword() {
    this.showPwd = !this.showPwd
  }

  isNumberInput(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getAddressByPincode(pincode: string, formName: string) {
    if ((this.userBasicDetailsUIModel.controls['pincode'].valid || this.userCompanyDetailsUIModel.controls['pincode'].valid) && pincode != '') {
      this.userService.getAddressByPincode(pincode).subscribe((result: any) => {
        if (result[0].Status == "Success") {
          this.address = result[0].PostOffice[0]
          if (formName == "userDetails") {
            this.userBasicDetailsUIModel.controls['city'].patchValue(this.address.Division);
            this.userBasicDetailsUIModel.controls['state'].patchValue(this.address.State);
            this.userBasicDetailsUIModel.controls['country'].patchValue(this.address.Country);
          }
          if (formName == "companyDetails") {
            this.userCompanyDetailsUIModel.controls['city'].patchValue(this.address.Division);
            this.userCompanyDetailsUIModel.controls['state'].patchValue(this.address.State);
            this.userCompanyDetailsUIModel.controls['country'].patchValue(this.address.Country);
          }
        }
        else {
          alert("This pincode does not exists, please enter correct pincode.")
          if (formName == "userDetails") {
            this.userBasicDetailsUIModel.controls['pincode'].reset()
            this.userBasicDetailsUIModel.controls['city'].reset()
            this.userBasicDetailsUIModel.controls['state'].reset()
            this.userBasicDetailsUIModel.controls['country'].reset()
          }
          if (formName == "companyDetails") {
            this.userCompanyDetailsUIModel.controls['pincode'].reset()
            this.userCompanyDetailsUIModel.controls['city'].reset()
            this.userCompanyDetailsUIModel.controls['state'].reset()
            this.userCompanyDetailsUIModel.controls['country'].reset()
          }
        }
      })
    }
    else {
      if (formName == "userDetails") {
        this.userBasicDetailsUIModel.controls['city'].reset()
        this.userBasicDetailsUIModel.controls['state'].reset()
        this.userBasicDetailsUIModel.controls['country'].reset()
      }
      if (formName == "companyDetails") {
        this.userCompanyDetailsUIModel.controls['city'].reset()
        this.userCompanyDetailsUIModel.controls['state'].reset()
        this.userCompanyDetailsUIModel.controls['country'].reset()
      }
    }
  }

  showCompanyDetailsCard(role: string) {
    // this.showCompanyCard = role == "Vendor" ? true : false
  }

  validateAccountNumber() {
    this.isAccountNumberConfirm = this.userBankDetailsUIModel.value.accountNumber != this.userBankDetailsUIModel.value.confirmAccountNumber && this.userBankDetailsUIModel.value.confirmAccountNumber != '' ? false : true
  }

  getBankDetailsByIFSCCode(ifscCode: string) {
    if (this.userBankDetailsUIModel.controls['ifscCode'].valid) {
      this.userService.getBankDetailsByIFSCCode(ifscCode).subscribe((result: any) => {
        if (result != null) {
          this.userBankDetailsUIModel.controls['bankName'].patchValue(result.BANK);
          this.userBankDetailsUIModel.controls['branch'].patchValue(result.BRANCH);
        }
      }, (error: { status: number; }) => {
        if (error.status == 404) {
          alert("This IFSC code does not exists, please enter correct IFSC code.")
          this.userBankDetailsUIModel.controls['ifscCode'].reset()
        }
      });
    }
  }

  userRegistration() {
    this.userUIModel = {};
    this.isFormValid = true
    if (this.userBasicDetailsUIModel.invalid || this.userCompanyDetailsUIModel.invalid || this.userBankDetailsUIModel.invalid) {
      return;
    }
    else {
      var userBasicDetailsUIModel: any = {
        name: this.userBasicDetailsUIModel.value.name.trim(),
        email: this.userBasicDetailsUIModel.value.email.trim(),
        mobile: this.userBasicDetailsUIModel.value.mobile.toString().trim(),
        password: this.userBasicDetailsUIModel.value.password.trim(),
        role: this.userBasicDetailsUIModel.value.role,
        identificationType: this.userBasicDetailsUIModel.value.identificationType,
        identificationNumber: this.userBasicDetailsUIModel.value.identificationNumber.trim(),
        pincode: this.userBasicDetailsUIModel.value.pincode.trim(),
        city: this.userBasicDetailsUIModel.getRawValue().city,
        state: this.userBasicDetailsUIModel.getRawValue().state,
        country: this.userBasicDetailsUIModel.getRawValue().country,
        fullAddress: this.userBasicDetailsUIModel.value.fullAddress.trim()
      }
      var userCompanyDetailsUIModel: any = {
        companyName: this.userCompanyDetailsUIModel.value.companyName.trim(),
        description: this.userCompanyDetailsUIModel.value.description.trim(),
        dealingPerson: this.userCompanyDetailsUIModel.value.dealingPerson.trim(),
        gstin: this.userCompanyDetailsUIModel.value.gstin.trim(),
        pincode: this.userCompanyDetailsUIModel.value.pincode.trim(),
        city: this.userCompanyDetailsUIModel.getRawValue().city,
        state: this.userCompanyDetailsUIModel.getRawValue().state,
        country: this.userCompanyDetailsUIModel.getRawValue().country,
        fullAddress: this.userCompanyDetailsUIModel.value.fullAddress.trim(),
      }
      var userBankDetailsUIModel: any = {
        accountHolderName: this.userBankDetailsUIModel.value.accountHolderName.trim(),
        accountNumber: this.userBankDetailsUIModel.value.accountNumber.trim(),
        ifscCode: this.userBankDetailsUIModel.value.ifscCode.trim(),
        bankName: this.userBankDetailsUIModel.getRawValue().bankName,
        branch: this.userBankDetailsUIModel.getRawValue().branch,
      }
      this.userUIModel = {
        userBasicDetailsUIModel: userBasicDetailsUIModel,
        userCompanyDetailsUIModel: userCompanyDetailsUIModel,
        userBankDetailsUIModel: userBankDetailsUIModel
      };
      this.userService.userRegistration(this.userUIModel).subscribe((result: any) => {
        alert(result.message)
        if (result.status) {
          this.userBasicDetailsUIModel.reset()
          this.userCompanyDetailsUIModel.reset()
          this.userBankDetailsUIModel.reset()
          this.isFormValid = false
        }
      })
    }
  }

}
