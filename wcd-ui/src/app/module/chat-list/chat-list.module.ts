import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MaterialModule, MdTableModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk';
import { ChatListComponent, UserinfoComponent, PasswordComponent } from './chat-list.component';

const chat_list_routes: Routes = [
    { path: '', component: ChatListComponent },
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MdTableModule,
        MaterialModule,
        CdkTableModule,
        RouterModule.forChild(chat_list_routes)
    ],
    entryComponents: [
        UserinfoComponent,
        PasswordComponent
    ],
    declarations: [ChatListComponent, UserinfoComponent, PasswordComponent]
})
export class ChatListModule { }
