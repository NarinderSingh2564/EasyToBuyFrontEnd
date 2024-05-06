import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProductList(categoryId:number , searchText:string , vendorId:number,role:string) {
    return this.http.get("https://localhost:7239/api/Product/GetProductList?categoryId=" + categoryId + "&searchText=" + searchText + "&vendorId=" + vendorId+"&role="+role)
  }

  productAddEdit(objProduct: any) {
    return this.http.post("https://localhost:7239/api/Product/ProductAddEdit", objProduct)
  }

  getProductDetailsById(id: number) {
    return this.http.get("https://localhost:7239/api/Product/GetProductDetailsById?productId=" + id)
  }

  getProductWeightList() {
    return this.http.get("https://localhost:7239/api/Product/GetProductWeightList")
  }

}
