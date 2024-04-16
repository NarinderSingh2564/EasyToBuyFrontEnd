import { Component } from '@angular/core';

@Component({
  selector: 'app-product-description',
  standalone: true,
  templateUrl: './product-description.component.html',
  styleUrl: './product-description.component.css'
})

export class ProductDescriptionComponent {
 
  selectedImage = 'assets/images/2.jpg';

  onThumbClick(index: string){
    this.selectedImage='assets/images/'+index+'.jpg';
  }

}





