import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,RouterLink,CommonModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm:FormGroup;
  isFormValid:boolean=false;
  response:any=[];

  constructor(private formBuilder:FormBuilder,private accountService:AccountService,private router:Router){
    this.registerForm = this.formBuilder.group({
      name:new FormControl(null,[Validators.required]),
      email:new FormControl(null,[Validators.required,Validators.email]),
      mobile:new FormControl(null,[Validators.required,Validators.minLength(10)]),
      password:new FormControl(null,[Validators.required,Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{4,}$")])
    })
  }
  
  get controls(){
    return this.registerForm.controls;
  }

  onRegister(){
    this.isFormValid = true
    if(this.registerForm.invalid){
      return;
    }
    else{
      alert("data post")
    }
  }
}
