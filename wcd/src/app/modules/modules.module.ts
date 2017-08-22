import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderModule } from './header/header.module';

@NgModule({
  imports: [
    CommonModule,
    HeaderModule
  ],
  exports: [
    HeaderModule
  ],
  declarations: []
})
export class ModulesModule { }
