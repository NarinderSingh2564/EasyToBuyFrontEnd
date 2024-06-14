import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-images',
  standalone: true,
  imports: [],
  templateUrl: './product-images.component.html',
  styleUrl: './product-images.component.css',
  outputs:['childEvent']
})
export class ProductImagesComponent {

  selectedFiles?: FileList;
  productImages: string[] = [];
  childEvent = new EventEmitter()
  numberOfFiles:number=0

  selectFiles(event: any): void {
   
    this.selectedFiles = event.target.files;
   
    this.productImages = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      this.numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < this.numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.productImages.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
    
  }

  sendImagesToParent(){
    this.childEvent.emit(this.productImages)
  }


  uploadImages(){
    if(this.numberOfFiles > 5){
      alert("You can not upload more than 4 images.");
      
    }
  }
}
