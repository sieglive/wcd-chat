import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorDirective } from './color.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    ColorDirective
  ],
  declarations: [
    ColorDirective
  ]
})
export class ColorModule { }
