/* use fuColor to set the background color
  select from teal,green,blue,purple,yellow,orange,red,silver,gray,black
  add a -l to it to use the light one

  after fuColor(can be empty) use fuText to set the text color
*/

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
