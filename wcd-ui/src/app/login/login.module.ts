import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';

import { LoginComponent } from './login.component';
const login_routes: Routes = [
  { path: '', component: LoginComponent },
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    RouterModule.forChild(login_routes)
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }
