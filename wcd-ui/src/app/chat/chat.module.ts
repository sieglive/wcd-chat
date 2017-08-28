import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MessageService, WcdAvatorDirective } from '../service/message.service';

import { ChatComponent, UserInfoComponent } from './chat.component';


const chat_routes: Routes = [
    { path: '', component: ChatComponent },
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        RouterModule.forChild(chat_routes)
    ],
    entryComponents: [
        UserInfoComponent
    ],
    declarations: [ChatComponent, UserInfoComponent, WcdAvatorDirective]
})
export class ChatModule { }
