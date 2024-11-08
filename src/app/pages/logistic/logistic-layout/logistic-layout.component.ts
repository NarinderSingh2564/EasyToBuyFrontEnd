import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { CommonModule } from '@angular/common';
import { routes } from '../../../app.routes';

@Component({
  selector: 'app-logistic-layout',
  standalone: true,
  imports: [RouterOutlet,CommonModule,RouterLink],
  templateUrl: './logistic-layout.component.html',
  styleUrl: './logistic-layout.component.css'
})
export class LogisticLayoutComponent {
  router = inject(Router);
  accountService = inject(AccountService);

  userName:string=this.accountService.getUserName();

  Logout(){
    sessionStorage.clear();
    this.router.navigate(['/AllProducts']);
  }
}
