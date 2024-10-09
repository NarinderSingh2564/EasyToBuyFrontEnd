import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vendor-layout',
  standalone: true,
  imports: [RouterOutlet,RouterLink,CommonModule],
  templateUrl: './vendor-layout.component.html',
  styleUrl: './vendor-layout.component.css'
})
export class VendorLayoutComponent {
  
  router = inject(Router);
  accountService = inject(AccountService);

  userName:string=this.accountService.getUserName();

  Logout(){
    sessionStorage.clear();
    this.router.navigate(['/AllProducts']);
  }
}
