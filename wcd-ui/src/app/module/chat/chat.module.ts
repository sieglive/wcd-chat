import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';

import { MessageService } from 'app/service/message.service';
import { AvatorDirective } from 'app/directive/avator.directive';
import { MarkdownDirective } from 'app/directive/markdown.directive';
import { MarkdownService } from 'app/service/markdown.service';
import { ChatComponent, UserInfoComponent } from './chat.component';

const chat_routes: Routes = [
    { path: '', component: ChatComponent },
];

@NgModule({
    declarations: [
        ChatComponent,
        UserInfoComponent,
        AvatorDirective,
        MarkdownDirective
    ],
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        RouterModule.forChild(chat_routes)
    ],
    providers: [
        MarkdownService
    ],
    entryComponents: [
        UserInfoComponent
    ]
})
export class ChatModule { }
