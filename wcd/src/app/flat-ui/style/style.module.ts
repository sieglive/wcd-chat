import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorService } from './color.service';
import { ColorDirective } from './color.directive';
import { BackgroundDirective } from './background.directive';
import { ContainerComponent } from './container/container.component';
import { ButtonComponent } from './button/button.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    ColorDirective,
    BackgroundDirective,
    ContainerComponent,
    ButtonComponent
  ],
  declarations: [
    ColorDirective,
    BackgroundDirective,
    ContainerComponent,
    ButtonComponent
  ],
  providers: [ColorService]
})
export class StyleModule { }
