import { Component } from '@angular/core';
import { VendorService } from '../../../services/vendor.service';
import { AccountService } from '../../../services/account.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-dashboard.component.html',
  styleUrl: './vendor-dashboard.component.css'
})
export class VendorDashboardComponent {

   VendorCount:any;

  constructor(private vendorService: VendorService, private accountService: AccountService,private router:Router) {
    this.getVendorOrderCount()
  }

  getVendorOrderCount(){
    this.vendorService.vendorOrdersCount(this.accountService.getUserId()).subscribe(result=>{
      this.VendorCount= result;
      
    })
  }
  getAllOrders(){
    this.router.navigate(['/vendor-order-list',0]);
  }

  getPendingOrders(){
    this.router.navigate(['/vendor-order-list',1]);
  }
  getDeliveredOrders(){
    this.router.navigate(['/vendor-order-list',4]);
  }
  getCancelOrders(){
    this.router.navigate(['/vendor-order-list',5]);
  }
  
}



