import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {

  registerForm: FormGroup;
  isFormValid: boolean = false;
  response: any = [];
  showPwd: boolean = false
  constructor(private formBuilder: FormBuilder, private accountService: AccountService) {
    this.registerForm = this.formBuilder.group({
      fullName: new FormControl("",[Validators.required,this.whitespaceValidator()]),
      email: new FormControl("",[Validators.required, Validators.email]),
      mobile: new FormControl("",[Validators.required]),
      password: new FormControl("",[Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{4,}$")])
    })
  }

  get controls() {
    return this.registerForm.controls;
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

  Register() {
    this.isFormValid = true
    if (this.registerForm.invalid) {
      return;
    }
    else {
      const userObj: any = {
        fullName: this.registerForm.value.fullName.trim(),
        email:this.registerForm.value.email.trim(),
        mobile:this.registerForm.value.mobile.toString().trim(),
        password:this.registerForm.value.password.trim(),
      }
      this.accountService.userRegistration(userObj).subscribe((result: any) => {
        alert(result.message)
        this.registerForm.reset()
        this.isFormValid=false
      })
    }
  }
}
