import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlatPageComponent } from './flat-page/flat-page.component';
import { StyleModule } from './style/style.module';

const routes: Routes = [
  { path: '', component: FlatPageComponent }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    StyleModule
  ],
  exports: [StyleModule],
  declarations: [FlatPageComponent]
})
export class FlatUiModule { }
