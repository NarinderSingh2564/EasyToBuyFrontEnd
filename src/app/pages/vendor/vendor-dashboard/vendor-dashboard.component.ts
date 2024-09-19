import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AccountService } from '../../../services/account.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './vendor-dashboard.component.html',
  styleUrl: './vendor-dashboard.component.css'
})
export class VendorDashboardComponent {

  userOrdersCountList:any;

  constructor(private userService: UserService, private accountService: AccountService) {
    this.getUserOrderCount()
  }

  getUserOrderCount(){
    this.userService.userOrdersCount(this.accountService.getCustomerId()).subscribe(result=>{
      this.userOrdersCountList= result;
    })
  }
  
}



