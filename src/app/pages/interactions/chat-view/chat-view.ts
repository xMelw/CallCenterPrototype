import { Component, Input, signal  } from '@angular/core';
import { KeyValue, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-view.html',
  styleUrl: './chat-view.css',
})
export class ChatView {
  @Input() type!: 'client' | 'team';
  @Input() chatData: any;
  @Input() mode: 'client' | 'team' = 'client'

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

  getCategoryColor(category: string): string { // Obtem uma cor aleatoria para uma categoria
    let hash = 0;
    
    for (let i = 0; i < category.length; i++){
      hash += category.charCodeAt(i);
    }

    return this.categoryColors[hash % this.categoryColors.length];
  }

  getTagClass(tag: KeyValue<string | number | symbol, any>): any { //Obtem a class da Tag para alterar a cor caso seja 'categoria' ou 'prioridade'. Retorna uma cor padrao caso nao seja nenhum
    const key = String(tag.key);
    const value = String(tag.value);

    if (key === 'categoria'){
      return this.getCategoryColor(tag.value);
    }

    if (key === 'prioridade'){
      switch (value) {
        case 'Low':
          return 'border-green-300 bg-green-100 p-1 dark:border-green-300/10 dark:bg-green-400/10 text-green-700 dark:text-green-500';
        case 'Medium':
          return 'border-gray-300 bg-gray-100 p-1 dark:border-gray-300/10 dark:bg-gray-400/10 text-gray-700 dark:text-gray-500';
        case 'High':
          return 'border-red-300 bg-red-100 p-1 dark:border-red-300/10 dark:bg-red-400/10 text-red-700 dark:text-red-500';
      }
    
    return 'bg-slate-100 text-slate-800';
    }
  }

  sendMessage(){ //Envia mensagem para o chat
    const text = this.newMessage().trim();

    if(!text) return;

    const msg = {
      sender: 'agent',
      message: text,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    this.chatData = {
      ...this.chatData,
      chat: [...this.chatData.chat, msg]
    };
    this.newMessage.set('');
  }

  updateMessage(event: Event){ //Atualiza a mensagem no chat enviada.
    this.newMessage.set((event.target as HTMLInputElement).value);
  }

  onFileSelected(event: Event){
    const input = event.target as HTMLInputElement;

    if (!input.files) return;

    this.selectedFiles = Array.from(input.files);

    console.log('Ficheiros selecionados:', this.selectedFiles);
  }

  selectTeamGroup(group: any){
    this.selectTeamGroup = group;
  }

}
