import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  public updateDeliveryAddress$: Subject<boolean> = new Subject();
  
  customerRegistration(customerObj: any) {
    return this.http.post("https://localhost:7239/api/Account/CustomerRegistration", customerObj)
  }

  checkUser(loginObj: any) {
    return this.http.post("https://localhost:7239/api/Account/CheckUser", loginObj)
  }
  
  setUserSession(userObj: any) {
    sessionStorage.setItem("UserSessionDetails", JSON.stringify(userObj));
  }

  getUserId() {
    const activeUser = JSON.parse(sessionStorage.getItem("UserSessionDetails") || '""')
    return Object(activeUser)["id"]
  }

  getUserName() {
    const activeUser = JSON.parse(sessionStorage.getItem("UserSessionDetails") || '""')
    return Object(activeUser)["name"]
  }

  getUserRole() {
    const activeUser = JSON.parse(sessionStorage.getItem("UserSessionDetails") || '""')
    return Object(activeUser)["role"]
  }

  getAddressListByCustomerId() {
    const customerId = this.getUserId();
    return this.http.get("https://localhost:7239/api/Account/GetAddressListByCustomerId?customerId=" + customerId)
  }

  getAddressTypeList() {
    return this.http.get("https://localhost:7239/api/Account/GetAddressTypeList")

  }

  getAddressByPincode(pincode: string) {
    return this.http.get("https://api.postalpincode.in/pincode/" + pincode)
  }

  addressAddEdit(addressObj:any){
    return this.http.post("https://localhost:7239/api/Account/AddressAddEdit",addressObj)
  }

  setDeliveryAddress(addressId:number, customerId:number){
    return this.http.post("https://localhost:7239/api/Account/SetDeliveryAddress?addressId=" + addressId + "&customerId=" + customerId,addressId)
  }

}
