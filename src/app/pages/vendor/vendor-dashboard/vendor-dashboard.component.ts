import { Component } from '@angular/core';
import { VendorService } from '../../../services/vendor.service';
import { AccountService } from '../../../services/account.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './vendor-dashboard.component.html',
  styleUrl: './vendor-dashboard.component.css'
})
export class VendorDashboardComponent {

  vendorOrdersCountList:any;

  constructor(private vendorService: VendorService, private accountService: AccountService,private router:Router) {
    this.getVendorOrderCount()
  }

  getVendorOrderCount(){
    this.vendorService.vendorOrdersCount(this.accountService.getUserId()).subscribe(result=>{
      this.vendorOrdersCountList= result;
    })
  }
  
}



