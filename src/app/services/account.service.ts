import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  checkUser(loginObj: any) {
    return this.http.post("https://localhost:7239/api/Account/CheckUser", loginObj)
  }

  userLoginDetails(userObj: any) {
    sessionStorage.setItem("session", JSON.stringify(userObj));
  }

  getCustomerId() {
    const activeCustomer = JSON.parse(sessionStorage.getItem("session") || '""')
    return Object(activeCustomer)["id"]
  }
  getCustomerName() {
    const activeCustomer = JSON.parse(sessionStorage.getItem("session") || '""')
    return Object(activeCustomer)["fullName"]
  }
}
