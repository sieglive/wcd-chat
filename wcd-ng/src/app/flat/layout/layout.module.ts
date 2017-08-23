/* use fuContent and fuContainer to set the layout of element
  fuContent can be none,1-10,page, when using 1-10 as an attribute
  fuContainer is needed
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentDirective, ContainerDirective, CenterDirective, MiddleDirective } from './layout.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    ContentDirective,
    ContainerDirective,
    CenterDirective,
    MiddleDirective
  ],
  declarations: [
    ContentDirective,
    ContainerDirective,
    CenterDirective,
    MiddleDirective
  ]
})
export class LayoutModule { }
