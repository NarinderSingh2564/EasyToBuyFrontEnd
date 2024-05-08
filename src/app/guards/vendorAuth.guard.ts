import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const vendorAuthGuard : CanActivateFn = (route, state) => {

 const router = inject(Router);
 
    if(sessionStorage.getItem('VendorSessionDetails') != null){
      return true;
    } 
    else {
      router.navigate(['/vendor-login'])
      return false;
    }
};