import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})

export class CategoryComponent implements OnInit {

  isSidePanelVisible: boolean = false;
  categoryList: any = [];
  response: any = [];
  categoryForm: FormGroup;
  isFormValid: boolean = false;
  isEdit: boolean = false;
  display = "none";

  ngOnInit(): void {
    this.getCategoryList()
  }

  constructor(private formBuilder: FormBuilder, private categoryService: CategoryService, private accountService: AccountService) {
    this.categoryForm = this.formBuilder.group({
      id: new FormControl(0),
      categoryName: new FormControl("", [Validators.required]),
      packingMode: new FormControl("", [Validators.required]),
      isActive: new FormControl(false)
    })
  }

  get controls() {
    return this.categoryForm.controls;
  }


  openModal() {
    this.display = "block";
  }

  closeModal() {
    this.display = "none";
  }

  addCategory() {
    this.isEdit = false
    this.isFormValid = false
    this.categoryForm.reset()
  }

  editCategory(category: any) {
    this.isEdit = true;
    this.categoryForm.patchValue(category);
  }

  getCategoryList() {
    this.categoryService.getCategoryList().subscribe(result => {
      this.categoryList = result
    })
  } 

  CategoryAddEdit() {
    this.isFormValid = true
    if (this.categoryForm.invalid) {
      return;
    }
    else {
      const category: any = {
        id: this.categoryForm.value.id != null && this.categoryForm.value.id > 0 ? this.categoryForm.value.id : 0,
        categoryName: this.categoryForm.value.categoryName,
        packingModeId: this.categoryForm.value.packingMode == "kg" ? 1 : 2,
        createdBy: this.accountService.getCustomerId(),
        updatedBy: this.accountService.getCustomerId(),
        isActive: this.categoryForm.value.isActive,
      }
      this.categoryService.categoryAddEdit(category).subscribe(result => {
        this.response = result;
        if (this.response.status) {
          alert(this.response.message);
          this.closeModal();
          this.getCategoryList();
        }
        else {
          alert(this.response.message);
        }
      });
    }
  }

}
