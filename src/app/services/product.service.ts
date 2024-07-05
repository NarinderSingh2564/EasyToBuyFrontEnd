import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProductList(categoryId: number, searchText: string, vendorId: number, role: string) {
    return this.http.get("https://localhost:7239/api/Product/GetProductList?categoryId=" + categoryId + "&searchText=" + searchText + "&vendorId=" + vendorId + "&role=" + role)
  }

  productAddEdit(productUIModel: any) {
    return this.http.post("https://localhost:7239/api/Product/ProductAddEdit", productUIModel)
  }

  getProductDescriptionById(id: number) {
    return this.http.get("https://localhost:7239/api/Product/GetProductDescriptionById?productId=" + id)
  }

  getProductWeightList() {
    return this.http.get("https://localhost:7239/api/Product/GetProductWeightList")
  }

  getProductPackingList() {
    return this.http.get("  https://localhost:7239/api/Product/GetProductPackingList")
  }

  productVariationAddEdit(variation:any){
    return this.http.post("https://localhost:7239/api/Product/ProductVariationAndRateAddEdit", variation)
  }

  getProductSpecificationById(id: number) {
    return this.http.get("https://localhost:7239/api/Product/GetProductSpecificationById?productId=" + id)
  }

  getProductVariationListById(id: number) {
    return this.http.get("https://localhost:7239/api/Product/GetProductVariationListById?productId=" + id)
  }

  getProductVariationImageById(id: number) {
    return this.http.get("https://localhost:7239/api/Product/GetProductVariationImageById?variationId=" + id)

   }
   
   getDefaultVariation(productId:number, variationId:number){
    return this.http.post("https://localhost:7239/api/Product/GetDefaultVariation?productId=" + productId + "&variationId=" + variationId,productId)
   }

  

  setDefaultVariation(productId: number, variationId: number) {
    return this.http.post("https://localhost:7239/api/Product/GetDefaultVariation?productId=" + productId + "&variationId=" + variationId, productId)
  }

  productSpecificationAddEdit(specification:any){
    return this.http.post("https://localhost:7239/api/Product/ProductSpecificationAddEdit",specification)
  }

  getProductVariationListByProductId(productId:number){
    return this.http.get("https://localhost:7239/api/Product/GetProductVariationListByProductId?productId=" + productId)
  }


  productVariationImagesAdd(imagesObj:any){
    return this.http.post("https://localhost:7239/api/Product/ProductVariationImagesAdd",imagesObj)
  }
  getVariationImagesListByProductId(productId:number){
    return this.http.get("https://localhost:7239/api/Product/GetVariationImagesListByProductId?productId=" + productId)
  }
  
}
