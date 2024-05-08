import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators , FormGroup,FormControl,FormBuilder, AbstractControl} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { CommonModule } from '@angular/common';
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

  constructor(private formBuilder:FormBuilder,private accountService:AccountService,private router:Router){
    this.loginForm = this.formBuilder.group({
      mobile:new FormControl(null,[Validators.required,Validators.maxLength(10)]),
      password:new FormControl(null,[Validators.required]),
    })
  }
  
  get controls(){
    return this.loginForm.controls;
  }

  onLogin(){
    this.isFormValid = true
    if(this.loginForm.invalid){
      return;
    }
    else{
      this.accountService.checkUser(this.loginForm.value).subscribe(result => {
            this.response = result;
            if(this.response.status){
              if(this.response.response.id ==1){
                this.router.navigate(['/products']);
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
}