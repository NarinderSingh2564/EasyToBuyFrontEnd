import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { OrderService } from '../../../services/order.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EasyToBuyHelper } from '../../../helpers/EasyToBuyHelper';
import { Console } from 'node:console';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './customer-orders.component.html',
  styleUrl: './customer-orders.component.css'
})
export class CustomerOrdersComponent {

  orderService = inject(OrderService)
  accountService = inject(AccountService)
  productService = inject(ProductService)
  router = inject(Router)

  ratingForm: FormGroup;
  isFormValid: boolean = false;
  ratingImageList: any = []
  orderList: any = []
  productIds: number = 0
  btnSubmit:boolean= false
  orderStatusTrackingList: any = []
  currentStatusId: number = 0
  timelineHeight: boolean = false
  baseUrl: string = EasyToBuyHelper.imageBaseUrl;
  reviewTitle: string = '';
  ratingNumber : number = 0; 


  constructor(private formBuilder: FormBuilder) {
    this.getOrderList();

    this.ratingForm = this.formBuilder.group({
      id: new FormControl(0),
      reviewTitle: new FormControl("", [Validators.required]),
      rating: new FormControl("", [Validators.required]),
      productId: new FormControl("", [Validators.required]),
      reviewDescription: new FormControl("", [Validators.required]),
      productRatingImage: new FormControl("", [Validators.required]),
    })
  }

  getOrderList() {
    this.orderService.getOrdersList(this.accountService.getCustomerId(), "", 0, "", "").subscribe((result: any) => {
      this.orderList = result
    })
  }

  addRatings(){
    this.isFormValid = false
  }

  searchProducts(searchText: string) {
    this.orderService.getOrdersList(this.accountService.getCustomerId(), searchText, 0, "", "").subscribe((result: any) => {
      this.orderList = result
    })
  }

  filterOrdersByType(event: any) {
    this.orderService.getOrdersList(this.accountService.getCustomerId(), "", event.target.value, "", "").subscribe((result: any) => {
      this.orderList = result
    })
  }

  filterOrdersByMonth(event: any) {
    if (event.target.value == 1) {
      var FirstDate = new Date();
      FirstDate.setMonth(FirstDate.getMonth() - 1);
      this.orderService.getOrdersList(this.accountService.getCustomerId(), "", 0, FirstDate.toLocaleDateString(), (new Date()).toLocaleDateString()).subscribe((result: any) => {
        this.orderList = result
      })
    }
    else if (event.target.value == 3) {
      var FirstDate = new Date();
      FirstDate.setMonth(FirstDate.getMonth() - 3);
      this.orderService.getOrdersList(this.accountService.getCustomerId(), "", 0, FirstDate.toLocaleDateString(), (new Date()).toLocaleDateString()).subscribe((result: any) => {
        this.orderList = result
      })
    }
    else {
      var FirstDate = new Date();
      FirstDate.setMonth(FirstDate.getMonth() - 6);
      this.orderService.getOrdersList(this.accountService.getCustomerId(), "", 0, FirstDate.toLocaleDateString(), (new Date()).toLocaleDateString()).subscribe((result: any) => {
        this.orderList = result
      })
    }
  }

  filterOrdersByDates(firstDate: any, secondDate: any) {
    this.orderService.getOrdersList(this.accountService.getCustomerId(), "", 0, firstDate, secondDate).subscribe((result: any) => {
      this.orderList = result
    })
  }

  getProductDescription(productId: number) {
    this.router.navigate(['product-description', productId])
  }

  getProductId(Id: any) {
    this.productIds = Id
  }

  getOrderStatusTrackingList(orderNumber: any, statusId: number, variationId: number) {
    this.currentStatusId = statusId
    this.timelineHeight = false;
    if (this.currentStatusId == 5 || this.currentStatusId == 6) {
      this.timelineHeight = true
     }
    this.orderService.getOrderStatusTrackingList(orderNumber, variationId).subscribe((result: any) => {
      this.orderStatusTrackingList = []
      
      if (result[5].isPending == true) {
        this.orderStatusTrackingList.push(result[0])
        this.orderStatusTrackingList.push(result[5])
      }
      else if (result[4].isPending == true ) {
        this.orderStatusTrackingList.push(result[0])
        this.orderStatusTrackingList.push(result[4])
      }
      else {
        this.orderStatusTrackingList.push(result[0])
        this.orderStatusTrackingList.push(result[1])
        this.orderStatusTrackingList.push(result[2])
        this.orderStatusTrackingList.push(result[3])
        this.orderStatusTrackingList.push(result[4])
      }
    })
  }

  mySet(myvalues : any){
    this.reviewTitle = myvalues.reviewTitle;
    this.ratingNumber = myvalues.ratingNumber;
 }

 selectedImages(event: any){
  if(event.target.files.length > 3){
    alert("You can not upload more than 3 images.")
  }
  else{
  
    this.ratingImageList = []
    for (var i = 0; i < event.target.files.length; i++) {
      this.ratingImageList.push(event.target.files[i]);
    }
  }
 }

 RatingAdd(){
   if( this.isFormValid = true) {
    this.ratingForm.value.productId = this.productIds;
    this.ratingForm.value.reviewTitle = this.reviewTitle;
    const formData = new FormData();
      formData.set("id", this.ratingForm.value.id != null && this.ratingForm.value.id > 0 ? this.ratingForm.value.id : 0);
      formData.set("rating",  this.ratingForm.value.rating);
      formData.set("reviewTitle", this.ratingForm.value.reviewTitle);
      formData.set("productId", this.ratingForm.value.productId);
      formData.set("reviewDescription", this.ratingForm.value.reviewDescription);
      formData.set("customerId", this.accountService.getCustomerId());
      for (var i = 0; i < this.ratingImageList.length; i++) {
        formData.append("productRatingImage", this.ratingImageList[i]);
      }     
      this.productService.ratingReviewAdd(formData).subscribe((result:any) => {
        if (result.status) {
          alert("Rating Add Sucessful");
        }
        else {
          alert("Error");
        }
      });
    
    }
 }

}



