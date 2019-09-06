import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule} from '@angular/material'

import { AppComponent } from './app.component';
import { SearchBoxComponent } from './search-box/search-box.component';

@NgModule({
  declarations: [AppComponent, SearchBoxComponent],
  imports: [BrowserModule, BrowserAnimationsModule, FormsModule, HttpClientModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
