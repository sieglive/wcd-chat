import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';

import { ChatComponent, AppUserinfoComponent, WcdAvatorDirective } from './chat.component';

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
        AppUserinfoComponent
    ],
    declarations: [ChatComponent, AppUserinfoComponent, WcdAvatorDirective]
})
export class ChatModule { }
