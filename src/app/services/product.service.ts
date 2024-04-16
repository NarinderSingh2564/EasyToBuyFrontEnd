import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }


  

  getProductsList() {
    return this.http.get("https://localhost:7239/api/Product/GetProductList")
  }

  getProductWeightList() {
    return this.http.get("https://localhost:7239/api/Product/GetProductWeightList")
  }

  getProductDetails(id: number,searchText:string) {
    return this.http.get("https://localhost:7239/api/Product/GetProductDetails?categoryId=" + id + "&searchText=" + searchText)
  }

  getProductById(id: number) {
    return this.http.get("https://localhost:7239/api/Product/GetProductById?Id=" + id)
  }

  productAddEdit(objProduct: any) {
    return this.http.post("https://localhost:7239/api/Product/ProductAddEdit", objProduct)
  }
}
