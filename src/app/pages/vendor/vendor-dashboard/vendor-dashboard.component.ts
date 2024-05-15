import { Component } from '@angular/core';
import { VendorService } from '../../../services/vendor.service';
import { AccountService } from '../../../services/account.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-dashboard.component.html',
  styleUrl: './vendor-dashboard.component.css'
})
export class VendorDashboardComponent {

   VendorCount:any;

  constructor(private vendorService: VendorService, private accountService: AccountService) {
    this.getVendorOrderCount()
  }

  getVendorOrderCount(){
    this.vendorService.vendorOrdersCount(this.accountService.getUserId()).subscribe(result=>{
      this.VendorCount= result;
      
    })
  }

}



