import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/flat', pathMatch: 'full' },
  {
    path: 'flat',
    loadChildren: 'app/flat-ui/flat-ui.module#FlatUiModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
