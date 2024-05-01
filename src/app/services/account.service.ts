import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  public updateDeliveryAddress$: Subject<boolean> = new Subject();
  
  userRegistration(userObj: any) {
    return this.http.post("https://localhost:7239/api/Account/UserRegistration", userObj)
  }

  checkUser(loginObj: any) {
    return this.http.post("https://localhost:7239/api/Account/CheckUser", loginObj)
  }
  
  userLoginDetails(userObj: any) {
    sessionStorage.setItem("session", JSON.stringify(userObj));
  }

  getUserId() {
    const activeUser = JSON.parse(sessionStorage.getItem("session") || '""')
    return Object(activeUser)["id"]
  }

  getUserName() {
    const activeUser = JSON.parse(sessionStorage.getItem("session") || '""')
    return Object(activeUser)["fullName"]
  }

  getAddressListByUserId() {
    const userID = this.getUserId();
    return this.http.get("https://localhost:7239/api/Account/GetAddressListByUserId?userID=" + userID)
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

  setDeliveryAddress(id:number, userId:number){
    return this.http.post("https://localhost:7239/api/Account/SetDeliveryAddress?id=" + id + "&userId=" + userId , id)
  }

}
