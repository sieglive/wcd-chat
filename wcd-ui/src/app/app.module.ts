import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MaterialModule, MdTableModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CdkTableModule } from '@angular/cdk';
import { MdDialog, MdDialogRef } from '@angular/material';

import { MdSnackBar } from '@angular/material';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import 'hammerjs';

import { AppComponent } from './app.component';
import { AccountService, AddressGuard, AuthGuard, NickGuard, ChatGuard } from './service/guard.service';
import { MessageService } from './service/message.service';

const wcd_routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', loadChildren: 'app/login/login.module#LoginModule', canActivate: [AddressGuard, AuthGuard] },
    { path: 'chat/:chat_id', loadChildren: 'app/chat/chat.module#ChatModule', canActivate: [AddressGuard, ChatGuard] },
    { path: 'chat-list', loadChildren: 'app/chat-list/chat-list.module#ChatListModule', canActivate: [AddressGuard] },
    { path: 'error', loadChildren: 'app/error/error.module#ErrorModule' },
    { path: '**', redirectTo: '/error' }
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
    providers: [
        MdSnackBar,
        HttpClient,
        AddressGuard,
        AuthGuard,
        NickGuard,
        ChatGuard,
        AccountService,
        MessageService,
        MdDialog],
    bootstrap: [AppComponent]
})
export class AppModule { }
