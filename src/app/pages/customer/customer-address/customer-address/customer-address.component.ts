import { Component, Input, inject } from '@angular/core';
import { AccountService } from '../../../../services/account.service';
// import { AccountService } from '../../../services/account.services';

@Component({
  selector: 'app-customer-address',
  standalone: true,
  imports: [],
  templateUrl: './customer-address.component.html',
  styleUrl: './customer-address.component.css'
})
export class CustomerAddressComponent {

  @Input() UserID: any;
  userAddress: any;
  userAddressList: any;

  accountService = inject(AccountService);

  constructor() {
    this.getAddressList();

  }

  getAddressList() {
    this.accountService.getAddressListByUserId().subscribe((result: any) => {

      if (result.status) {
        this.userAddressList = result.response;
        alert(result.status)
      }


    })
  }

  // @Input() UserID: number;


}
