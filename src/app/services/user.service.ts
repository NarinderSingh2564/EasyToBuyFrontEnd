import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 
  constructor(private http: HttpClient) { }
  
  getAddressByPincode(pincode: string) {
    return this.http.get("https://api.postalpincode.in/pincode/" + pincode)
  }
   
  getBankDetailsByIFSCCode(ifscCode : string){
    return this.http.get("https://ifsc.razorpay.com/" + ifscCode)
  }

  userRegistration(userUIModel: any) {
    return this.http.post("https://localhost:7239/api/User/UserRegistration",userUIModel)
  }

  userOrdersCount(userId: number) {
    return this.http.get("https://localhost:7239/api/User/GetUserOrdersCount?userId="+ userId)
  }
}
