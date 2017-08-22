import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScaffoldRoutingModule } from './scaffold-routing.module';

import {ModulesModule} from 'app/modules/modules.module';
@NgModule({
  imports: [
    CommonModule,
    ScaffoldRoutingModule
  ],
  declarations: []
})
export class ScaffoldModule { }
