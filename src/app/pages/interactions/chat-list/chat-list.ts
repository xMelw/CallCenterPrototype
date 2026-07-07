import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat-list',
  imports: [DatePipe],
  templateUrl: './chat-list.html',
  styleUrl: './chat-list.css',
})
export class ChatList {

  @Input() conversations: any[] = [];
  @Output() selectedChat = new EventEmitter<any>();

  selectClient(client: any){
    this.selectedChat.emit(client);
  }

}
