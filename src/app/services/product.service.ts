import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProductList(productCategoryId: number, searchText: string, userId: number, role: string) {
    return this.http.get("https://localhost:7239/api/Product/GetProductList?productCategoryId=" + productCategoryId + "&searchText=" + searchText + "&userId=" + userId + "&role=" + role)
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

  productVariationAddEdit(variation: any) {
    return this.http.post("https://localhost:7239/api/Product/ProductVariationAndRateAddEdit", variation)
  }

  setShowProductWeight(variationId: number, showProducWeight: boolean) {
    return this.http.post("https://localhost:7239/api/Product/SetShowProductWeight?variationId=" + variationId + "&showProductWeight=" + showProducWeight,variationId)
  }

  setVariationIsActive(variationId:number , isActive:boolean){
    return this.http.post("https://localhost:7239/api/Product/SetVariationIsActive?variationId=" + variationId + "&isActive=" + isActive,variationId)
  }

  deleteProductVariation(variationId:number){
    return this.http.post("https://localhost:7239/api/Product/DeleteProductVariation?variationId=" + variationId, variationId)
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

  setDefaultVariation(productId: number, variationId: number, status: boolean) {
    return this.http.post("https://localhost:7239/api/Product/SetDefaultVariation?productId=" + productId + "&variationId=" + variationId + "&status=" + status, productId)
  }

  productSpecificationAddEdit(specification: any) {
    return this.http.post("https://localhost:7239/api/Product/ProductSpecificationAddEdit", specification)
  }
  getProductVariationListByProductId(productId: number) {
    return this.http.get("https://localhost:7239/api/Product/GetProductVariationListByProductId?productId=" + productId)
  }
  productVariationImagesAdd(imagesObj: any) {
    return this.http.post("https://localhost:7239/api/Product/ProductVariationImagesAdd", imagesObj)
  }
  getVariationImagesListByProductId(productId: number) {
    return this.http.get("https://localhost:7239/api/Product/GetVariationImagesListByProductId?productId=" + productId)
  }

  getProductSliderItemsByCategoryId(categoryId: number, productId: number, cateTypes: string) {
    return this.http.get("https://localhost:7239/api/Product/GetProductSliderItemsByCategoryId?categoryId=" +categoryId+"&productId=" +productId+ "&dataTypes=" + cateTypes)

  }

  checkVariationImagesCountById(variationId:number){
    return this.http.get("https://localhost:7239/api/Product/CheckVariationImagesCountById?variationId=" + variationId)
  }

  deleteProductVariationImage(productImageId: number) {
    return this.http.delete("https://localhost:7239/api/Product/DeleteProductVariationImage?productImageId=" + productImageId)
  }
  
  ratingReviewAdd(formData: any) {
    return this.http.post("https://localhost:7239/api/Product/ProductRatingAdd", formData)
  }


  getProductRatingReviewByProductId(id: number) {
    return this.http.get("https://localhost:7239/api/Product/GetProductRatingReviewByProductId?productId=" + id)
  }

  getDiscountProductListByDiscountValue(value : number){
     return this.http.get("https://localhost:7239/api/Product/GetDiscountProductsListByDiscountValue?discountValue=" + value)
  }

}
