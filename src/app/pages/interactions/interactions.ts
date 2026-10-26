import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatList } from './chat-list/chat-list';
import { ChatView } from './chat-view/chat-view';
import { BotBox } from './bot-box/bot-box';
import { ClientInfo } from './client-info/client-info';

@Component({
  selector: 'app-interactions',
  standalone: true,
  imports: [ChatList, ChatView, BotBox,ClientInfo],
  templateUrl: './interactions.html',
  styleUrl: './interactions.css',
})
export class Interactions implements OnInit {
  
  interactions: any;
  currentView: 'clientsList' | 'clientChat' | 'teamChat' = 'clientsList';

  clients: any[] = [];
  teamData: any = null;

  selectedClient: any = null; // é mandado para o chat-view(client)
  selectedTeamItem: any;
  selectedChatType: 'client' | 'group' | 'person' | null = null;

  activeSection: 'clients' | 'team' = 'clients';


  constructor(private http:HttpClient){}

  ngOnInit(): void {
    this.loadInteractions();
    this.setView('clientsList');
  }

  loadInteractions(){ // Carrega as interações do arquivo JSON
    this.http.get<any>('assets/db.json').subscribe(data => {
      this.clients = [...data.interactions.clientes].sort((a: any, b: any) =>
        new Date(b.data_mensagem).getTime() - new Date(a.data_mensagem).getTime()
      );
      this.teamData = data.interactions.team;

    });
  }

  setView(view: 'clientsList' | 'clientChat' |'teamChat'){
    this.currentView = view;
  }
  
  openClientChat(client: any){
    this.selectedClient = client;
    this.setView('clientChat');
  }

  openTeamChat(){
    this.setView('teamChat');

    this.selectedTeamItem = null;
    this.selectedChatType = null;
  }

  selectTeamItem(item: any, type: 'group' | 'person'){
    this.selectedTeamItem = item;
    this.selectedChatType = type;
  }

}
