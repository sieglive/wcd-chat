import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { ChatListComponent } from './chat-list.component';

const chat_list_routes: Routes = [
  { path: '', component: ChatListComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    RouterModule.forChild(chat_list_routes)
  ],
  declarations: [ChatListComponent]
})
export class ChatListModule { }
