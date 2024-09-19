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
  categoryForm: FormGroup;
  isFormValid: boolean = false;
  isEdit: boolean = false;

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

  categoryAddEdit() {
    this.isFormValid = true
    if (this.categoryForm.invalid) {
      return;
    }
    else {
      const category: any = {
        id: this.categoryForm.value.id != null && this.categoryForm.value.id > 0 ? this.categoryForm.value.id : 0,
        categoryName: this.categoryForm.value.categoryName,
        packingModeId: this.categoryForm.value.packingMode == "kg" ? 1 : 2,
        createdBy: this.accountService.getUserId(),
        updatedBy: this.accountService.getUserId(),
        isActive: this.categoryForm.value.isActive,
      }
      this.categoryService.categoryAddEdit(category).subscribe((result:any) => {
        if (result.status) {
          alert(result.message);
          this.getCategoryList();
        }
        else {
          alert(result.message);
        }
      });
    }
  }

}
