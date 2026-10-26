import { Component } from '@angular/core';
import { DataList } from '../../components/data-list/data-list';
import { NgClass } from '@angular/common';
import { GlobalSearchService } from '../../services/global-search';
import { AppDataService } from '../../services/app-data';

@Component({
  selector: 'app-history',
  imports: [DataList, NgClass],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History {

  constructor(
    private appData: AppDataService,
    private search: GlobalSearchService
  ){}

  selectedCall: any = null;
  callHistory : any[] = [];
  searchQuery = '';
  loading = true;
  loadError = false;

  ngOnInit(): void {
    this.loadInteractions();
    this.search.state$.subscribe(({ scope, query }) => {
      this.searchQuery = scope === 'history' || scope === 'all' ? query : '';
    });
  }

  loadInteractions(){ // Carrega as interações do arquivo JSON
    this.appData.load().subscribe({
      next: data => {
        this.callHistory = [...data.history].sort((a: any, b: any) =>
          new Date(b.data_hora.replace(' ', 'T')).getTime() - new Date(a.data_hora.replace(' ', 'T')).getTime()
        );
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
        this.callHistory = [...data.history].sort((a: any, b: any) =>
          new Date(b.data_hora.replace(' ', 'T')).getTime() - new Date(a.data_hora.replace(' ', 'T')).getTime()
        );
        this.loading = false;
        this.loadError = false;
      },
      error: () => { this.loading = false; this.loadError = true; }
    });
  }

  selectCall(call: any){
    this.selectedCall = call;
  }

  get filteredHistory(): any[] {
    const query = this.normalize(this.searchQuery);
    if (!query) return this.callHistory;

    return this.callHistory.filter(call =>
      [call.nome_do_user, call.numero_do_user, call.email, call.location, call.ia_note, call.ai_note_detailed, call.status]
        .some(value => this.normalize(value).includes(query))
    );
  }

  private normalize(value: unknown): string {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

}
