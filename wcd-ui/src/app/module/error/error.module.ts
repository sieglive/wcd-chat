import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';

import { ErrorComponent } from './error.component';

const error_routes: Routes = [
    { path: '', component: ErrorComponent },
    { path: '**', component: ErrorComponent },
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        RouterModule.forChild(error_routes)
    ],
    declarations: [ErrorComponent]
})
export class ErrorModule { }
