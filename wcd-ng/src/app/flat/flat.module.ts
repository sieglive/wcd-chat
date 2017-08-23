import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FlatComponent } from './flat.component';
import { ColorModule } from './color/color.module';
import { LayoutModule } from './layout/layout.module';

const routes: Routes = [
  { path: '', component: FlatComponent }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ColorModule,
    LayoutModule
  ],
  exports: [],
  declarations: [FlatComponent]
})
export class FlatModule { }
