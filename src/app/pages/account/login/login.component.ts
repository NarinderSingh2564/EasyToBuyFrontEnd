import { Component, Input } from '@angular/core';
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
  showPwd: boolean = false;

  constructor(private formBuilder:FormBuilder,private accountService:AccountService,private router:Router){
    this.loginForm = this.formBuilder.group({
      username:new FormControl(null,[Validators.required]),
      password:new FormControl(null,[Validators.required]),
    })
   
  }

  showPassword() {
    this.showPwd = !this.showPwd
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
      const loginObj = {
        username:this.loginForm.value.username,
        password:this.loginForm.value.password,
      }
      this.accountService.checkUser(loginObj).subscribe((result:any) => {
            if(result.status){
              this.accountService.setUserSession(result.response);
              // if(this.accountService.getUserRole() =="User"){
                this.router.navigate([result.response["redirect"]]);
              // }
              // else{
              //   this.router.navigate(['/AllProducts']);
              // }
            }
            else{
              alert(result.message)
            }
      });
    }
  }

  register(){
    // if(role=="User"){
    //   this.router.navigate(['/vendor-register']);
    // }
    // if(role=="Customer"){
    //   this.router.navigate(['/register']);
    // }
  }
}