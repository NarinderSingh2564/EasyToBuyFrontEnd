import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { VendorService } from '../../../services/vendor.service';


@Component({
  selector: 'app-vendor-register',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './vendor-register.component.html',
  styleUrl: './vendor-register.component.css'
})
export class VendorRegisterComponent {
    
  vendorregisterForm: FormGroup;
  isFormValid: boolean = false;
  response: any = [];
  address: any =[];
  showPwd: boolean = false;

  constructor(private formBuilder: FormBuilder, private vendorService: VendorService) {
    this.vendorregisterForm = this.formBuilder.group({
      name: new FormControl("",[Validators.required]),
      email: new FormControl("",[Validators.required, Validators.email]),
      mobile: new FormControl("",[Validators.required]),
      password: new FormControl("",[Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{4,}$")]),
      dealingPerson: new FormControl("",[Validators.required]),
      pincode: new FormControl("",[Validators.required]),
      city: new FormControl("",[Validators.required]),
      state: new FormControl("",[Validators.required]), 
      country: new FormControl("",[Validators.required]),
      fullAddress: new FormControl("",[Validators.required])
    })
  }

  get controls() {
    return this.vendorregisterForm.controls;
  }

  whitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { 'whitespace': true } : null;
    };
  }

  showPassword() {
    this.showPwd = !this.showPwd
  }


  getAddressByPincode(pincode: string) {
    this.vendorService.getAddressByPincode(pincode).subscribe((result: any) => {
      if (result[0].Status == "Success") {
        this.address = result[0].PostOffice[0]
        this.vendorregisterForm.controls['state'].patchValue(this.address.State);
        this.vendorregisterForm.controls['city'].patchValue(this.address.Division);
        this.vendorregisterForm.controls['country'].patchValue(this.address.Country);
      }
      else {
        alert("This pincode does not exists, please enter correct pincode.")
      }
    })
  }

  Register() {
    this.isFormValid = true
    if (this.vendorregisterForm.invalid) {
      return;
    }
    else {
      const vendorObj: any = {
        name: this.vendorregisterForm.value.name.trim(),
        email:this.vendorregisterForm.value.email.trim(),
        mobile:this.vendorregisterForm.value.mobile,
        password:this.vendorregisterForm.value.password.trim(),
        dealingPerson: this.vendorregisterForm.value.dealingPerson.trim(),
        pincode: this.vendorregisterForm.value.pincode.trim(),
        city: this.vendorregisterForm.value.city.trim(),
        state: this.vendorregisterForm.value.state.trim(),
        country: this.vendorregisterForm.value.country.trim(),
        fullAddress : this.vendorregisterForm.value.fullAddress.trim()
      }
      this.vendorService.vendorRegistration(vendorObj).subscribe((result: any) => {
        alert(result.message)
        this.vendorregisterForm.reset()
        this.isFormValid=false
      })  
    }
  }
}
