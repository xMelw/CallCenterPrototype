import { Component, OnInit } from '@angular/core';
import { ChatList } from './chat-list/chat-list';
import { ChatView } from './chat-view/chat-view';
import { BotBox } from './bot-box/bot-box';
import { ClientInfo } from './client-info/client-info';
import { GlobalSearchService } from '../../services/global-search';
import { AppDataService } from '../../services/app-data';

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
  searchQuery = '';
  loading = true;
  loadError = false;
  teamData: any = null;

  selectedClient: any = null; // é mandado para o chat-view(client)
  selectedTeamItem: any;
  selectedChatType: 'client' | 'group' | 'person' | null = null;

  activeSection: 'clients' | 'team' = 'clients';


  constructor(private appData: AppDataService, private search: GlobalSearchService){}

  ngOnInit(): void {
    this.loadInteractions();
    this.setView('clientsList');
    this.search.state$.subscribe(({ scope, query }) => {
      this.searchQuery = scope === 'inbox' || scope === 'all' ? query : '';
      if (scope === 'inbox') this.activeSection = 'clients';
    });
  }

  loadInteractions(){ // Carrega as interações do arquivo JSON
    this.appData.load().subscribe({
      next: data => {
        this.clients = [...data.interactions.clientes].sort((a: any, b: any) =>
          new Date(b.data_mensagem).getTime() - new Date(a.data_mensagem).getTime()
        );
        this.teamData = data.interactions.team;
        this.loading = false;
        this.loadError = false;
      },
      error: () => {
        this.loading = false;
        this.loadError = true;
      }
    });
  }

  retryLoad(): void {
    this.loading = true;
    this.appData.retry().subscribe({
      next: data => {
        this.clients = [...data.interactions.clientes].sort((a: any, b: any) =>
          new Date(b.data_mensagem).getTime() - new Date(a.data_mensagem).getTime()
        );
        this.teamData = data.interactions.team;
        this.loading = false;
        this.loadError = false;
      },
      error: () => { this.loading = false; this.loadError = true; }
    });
  }

  setView(view: 'clientsList' | 'clientChat' |'teamChat'){
    this.currentView = view;
  }
  
  openClientChat(client: any){
    this.selectedClient = client;
    this.setView('clientChat');
  }

  get filteredClients(): any[] {
    const query = this.normalize(this.searchQuery);
    if (!query) return this.clients;

    return this.clients.filter(client =>
      [client.nome, client.tipo_app, client.mensagem_recebida, client.ai_note, client.tags?.categoria]
        .some(value => this.normalize(value).includes(query))
    );
  }

  private normalize(value: unknown): string {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
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
