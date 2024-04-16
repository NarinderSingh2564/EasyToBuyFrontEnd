import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategoryList() {
    return this.http.get("https://localhost:7239/api/Category/GetCategoryList")
  }

  getCategoryById(id: number) {
    return this.http.get("https://localhost:7239/api/Category/GetCategoryById?Id=" + id)
  }

  categoryAddEdit(objCategory: any) {
    return this.http.post("https://localhost:7239/api/Category/CategoryAddEdit", objCategory)
  }

}
