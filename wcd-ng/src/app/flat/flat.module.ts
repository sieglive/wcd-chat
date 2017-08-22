import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FlatComponent } from './flat.component';
import { ColorModule } from './color/color.module';

const routes: Routes = [
  { path: '', component: FlatComponent }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ColorModule
  ],
  exports: [],
  declarations: [FlatComponent]
})
export class FlatModule { }
