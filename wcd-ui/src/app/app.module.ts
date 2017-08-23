import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MaterialModule, MdTableModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CdkTableModule } from '@angular/cdk';

import { MdSnackBar } from '@angular/material';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import 'hammerjs';

import { AppComponent } from './app.component';
import { AddressGuard, AuthGuard, NickGuard } from './service/guard.service';

const wcd_routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', loadChildren: 'app/login/login.module#LoginModule', canActivate: [AddressGuard, AuthGuard] },
    { path: 'chat', loadChildren: 'app/chat/chat.module#ChatModule', canActivate: [AddressGuard] },
    { path: 'error', loadChildren: 'app/error/error.module#ErrorModule' },
    { path: 'chat-list', loadChildren: 'app/chat-list/chat-list.module#ChatListModule', canActivate: [AddressGuard] },
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MdTableModule,
        MaterialModule,
        CdkTableModule,
        FormsModule,
        HttpClientModule,
        RouterModule.forRoot(wcd_routes)
    ],
    providers: [MdSnackBar, HttpClient, AddressGuard, AuthGuard, NickGuard],
    bootstrap: [AppComponent]
})
export class AppModule { }
