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

  vendorRegistration(vendorObj: any) {
    return this.http.post("https://localhost:7239/api/Vendor/VendorAddEdit",vendorObj)
  }

}
