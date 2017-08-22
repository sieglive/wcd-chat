import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MdSnackBar } from '@angular/material';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AddressGuard, AuthGuard, NickGuard } from './service/guard.service';

const wcd_routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', loadChildren: 'app/login/login.module#LoginModule', canActivate: [AddressGuard, NickGuard] },
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
        MaterialModule,
        FormsModule,
        HttpClientModule,
        RouterModule.forRoot(wcd_routes)
    ],
    providers: [MdSnackBar, HttpClient, AddressGuard, AuthGuard, NickGuard],
    bootstrap: [AppComponent]
})
export class AppModule { }
