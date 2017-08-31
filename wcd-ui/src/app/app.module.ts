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
import { AccountService, AddressGuard, AuthGuard, NickGuard, ChatGuard } from './service/guard.service';
import { MessageService } from './service/message.service';
import { SnackBarService } from './service/snack-bar.service';
import { WindowUtilsService } from './service/window-utils.service';
import { ErrorHandlerService } from './service/error-handler.service';
import { ToggleService } from './service/toggle.service';

const wcd_routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', loadChildren: 'app/login/login.module#LoginModule', canActivate: [AddressGuard] },
    { path: 'chat/:chat_id', loadChildren: 'app/chat/chat.module#ChatModule', canActivate: [AddressGuard, ChatGuard] },
    { path: 'chat-list', loadChildren: 'app/chat-list/chat-list.module#ChatListModule', canActivate: [AddressGuard, AuthGuard] },
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
        SnackBarService,
        WindowUtilsService,
        ErrorHandlerService,
        ToggleService,
        MdDialog],
    bootstrap: [AppComponent]
})
export class AppModule { }
