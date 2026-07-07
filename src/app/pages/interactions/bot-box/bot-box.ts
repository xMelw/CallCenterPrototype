import { Component, Input } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bot-box',
  imports: [DatePipe, CommonModule, FormsModule],
  templateUrl: './bot-box.html',
  styleUrl: './bot-box.css',
})
export class BotBox {
  @Input() type!: 'client' | 'team';
  @Input() chatData: any;
  @Input() teamChatData: any;

  colors = [
      'bg-red-500',
      'bg-yellow-500',
      'bg-lime-500',
      'bg-blue-500',
      'bg-purple-500',
      'bg-fuchsia-500',
      'bg-pink-500',
      'bg-rose-500',
    ];

  selectTeamGroup(group: any){
    this.selectTeamGroup = group;
  }

}
