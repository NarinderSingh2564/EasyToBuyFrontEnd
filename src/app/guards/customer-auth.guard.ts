import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';

export const customerAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const accountService = inject(AccountService)
  if (sessionStorage.getItem('UserSessionDetails') != null && accountService.getUserRole() == "Customer") {
    return true;
  }
  else {
    router.navigate(['/customer-login'])
    return false;
  }
};
