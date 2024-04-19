import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  userRegistration(userObj: any) {
    return this.http.post("https://localhost:7239/api/Account/UserRegistration",userObj)
  }
  
  checkUser(loginObj: any) {
    return this.http.post("https://localhost:7239/api/Account/CheckUser", loginObj)
  }

  getAddressListByUserId() {
    const userID = this.getCustomerId();
    return this.http.get("https://localhost:7239/api/Account/GetAddressListByUserId?userID="+userID )
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
