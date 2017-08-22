import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScaffoldComponent } from './scaffold/scaffold.component';

const routes: Routes = [{ path: '', component: ScaffoldComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [ScaffoldComponent]
})
export class ScaffoldRoutingModule { }
