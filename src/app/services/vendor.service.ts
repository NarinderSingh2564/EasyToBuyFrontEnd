import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(private http: HttpClient) { }
  
  getAddressByPincode(pincode: string) {
    return this.http.get("https://api.postalpincode.in/pincode/" + pincode)
  }

  getBankDetailsByIFSCCode(ifscCode : string){
    return this.http.get("https://ifsc.razorpay.com/" + ifscCode)
  }

  vendorRegistration(vendorUIModel: any) {
    return this.http.post("https://localhost:7239/api/Vendor/VendorRegistration",vendorUIModel)
  }

  vendorOrdersCount(vendorId: number) {
    return this.http.get("https://localhost:7239/api/Vendor/GetVendorOrdersCount?vendorId="+ vendorId)
  }
}
