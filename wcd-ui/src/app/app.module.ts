import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule, MdTableModule, MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { CdkTableModule } from '@angular/cdk';
import 'hammerjs';

import { AppComponent } from './app.component';
import { AddressGuard } from './guard/address.guard';
import { NickGuard } from './guard/nick.guard';
import { AuthGuard } from './guard/auth.guard';
import { ChatGuard } from './guard/chat.guard';
import { AccountService } from './service/account.service';
import { MessageService } from './service/message.service';
import { SnackBarService } from './service/snack-bar.service';
import { WindowUtilsService } from './service/window-utils.service';
import { ErrorHandlerService } from './service/error-handler.service';
import { ToggleService } from './service/toggle.service';
import { MarkdownService } from './service/markdown.service';

const wcd_routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', loadChildren: 'app/module/login/login.module#LoginModule', canActivate: [AddressGuard] },
    { path: 'chat/:chat_id', loadChildren: 'app/module/chat/chat.module#ChatModule', canActivate: [AddressGuard, ChatGuard] },
    { path: 'chat-list', loadChildren: 'app/module/chat-list/chat-list.module#ChatListModule', canActivate: [AddressGuard, AuthGuard] },
    { path: 'error', loadChildren: 'app/module/error/error.module#ErrorModule' },
    { path: '**', redirectTo: '/error' }
];

@NgModule({
    declarations: [
        AppComponent,
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
        MarkdownService,
        SnackBarService,
        WindowUtilsService,
        ErrorHandlerService,
        ToggleService,
        MdDialog],
    bootstrap: [AppComponent]
})
export class AppModule { }
