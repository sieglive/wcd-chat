import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';

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
  declarations: [ChatComponent]
})
export class ChatModule { }
