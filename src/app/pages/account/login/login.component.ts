import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators , FormGroup,FormControl,FormBuilder, AbstractControl} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { CommonModule } from '@angular/common';
import { PassThrough } from 'stream';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,RouterLink,CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent{
  
  loginForm:FormGroup;
  isFormValid:boolean=false;
  response:any=[];
  @Input() userRole:any;

  constructor(private formBuilder:FormBuilder,private accountService:AccountService,private router:Router){
    this.loginForm = this.formBuilder.group({
      mobile:new FormControl(null,[Validators.required,Validators.maxLength(10)]),
      password:new FormControl(null,[Validators.required]),
    })
   
  }
  
  get controls(){
    return this.loginForm.controls;
  }

  onLogin(role:string){
    this.isFormValid = true
    if(this.loginForm.invalid){
      return;
    }
    else{
      const loginObj = {
        mobile:this.loginForm.value.mobile,
        password:this.loginForm.value.password,
        role:role
      }
      this.accountService.checkUser(loginObj).subscribe(result => {
            this.response = result;
            if(this.response.status){
              if(role=="Vendor"){
                this.router.navigate(['/vendor-dashboard']);
              }
              else{
                this.router.navigate(['/AllProducts']);
              }
              this.accountService.setUserSession(this.response.response);
            }
            else{
              alert(this.response.message)
            }
      });
    }
  }

  register(role:string){
    if(role=="Vendor"){
      this.router.navigate(['/vendor-register']);
    }
    if(role=="Customer"){
      this.router.navigate(['/register']);
    }
  }
}