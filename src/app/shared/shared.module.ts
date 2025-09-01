import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearchInputComponent } from './components/search-input/search-input.component';


@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, SearchInputComponent],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, SearchInputComponent],
})
export class SharedModule {}