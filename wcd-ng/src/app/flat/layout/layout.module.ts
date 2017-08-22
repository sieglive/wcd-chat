import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutDirective } from './layout.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  exports:[
    LayoutDirective
  ],
  declarations: [LayoutDirective]
})
export class LayoutModule { }
