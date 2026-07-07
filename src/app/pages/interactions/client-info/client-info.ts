import { Component, Input, signal, Output, EventEmitter  } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-info',
  imports: [DatePipe, CommonModule, FormsModule],
  templateUrl: './client-info.html',
  styleUrl: './client-info.css',
})
export class ClientInfo {
  @Input() type!: 'client' | 'team';
  @Input() chatData: any;
  @Input() teamChatData: any;

  @Output() groupSelected = new EventEmitter<any>(); // manda um aviso para interactions.ts quando clica em alguma conversa que seja do tipo "group"
  @Output() personSelected = new EventEmitter<any>(); // manda um aviso para interactions.ts quando clica em alguma conversa que seja do tipo "person"

  activeTab = signal<'notes' | 'new'>('notes');
  priority = signal<'low' | 'medium' | 'high'>('low');
  newMessage = signal('');
  categoryColors = [
    'border-blue-300 bg-blue-100 p-1 dark:border-blue-300/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-500',
    'border-cyan-300 bg-cyan-100 p-1 dark:border-cyan-300/10 dark:bg-cyan-400/10 text-cyan-700 dark:text-cyan-500',
    'border-purple-300 bg-purple-100 p-1 dark:border-purple-300/10 dark:bg-purple-400/10 text-purple-700 dark:text-purple-500',
    'border-pink-300 bg-pink-100 p-1 dark:border-pink-300/10 dark:bg-pink-400/10 text-pink-700 dark:text-pink-500',
    'border-fuchsia-300 bg-fuchsia-100 p-1 dark:border-fuchsia-300/10 dark:bg-fuchsia-400/10 text-fuchsia-700 dark:text-fuchsia-500',
    'border-lime-300 bg-lime-100 p-1 dark:border-lime-300/10 dark:bg-lime-400/10 text-lime-700 dark:text-lime-500',
  ]
  selectedFiles: File[] = [];
  selectedTeamGroup: any = null; // é mandado para o chat-view(team)

  setPriority(event: Event){ //Seleciona a prioridade 
    const value = (event.target as HTMLSelectElement).value as 'low' | 'medium' | 'high';
    this.priority.set(value);
  }

  getLastMessage(chat: any[]){ //Obtem a ultima mensagem do chat
    return chat?.[chat.length - 1];
  }

  onGroupClick(group:any){
    this.groupSelected.emit(group);
  }

  onPersonClick(person:any){
    this.personSelected.emit(person);
  }

  selectTeamGroup(group: any){
    this.selectTeamGroup = group;
  }

}
