import { Component } from '@angular/core';
import { DataList } from '../../components/data-list/data-list';
import { NgClass } from '@angular/common';
import { GlobalSearchService } from '../../services/global-search';
import { AppDataService } from '../../services/app-data';

@Component({
  selector: 'app-contacts',
  imports: [DataList, NgClass],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css',
})
export class Contacts {

  constructor(
    private appData: AppDataService,
    private search: GlobalSearchService
  ) {}

  usersContacts : any[] = [];
  agentsContacts : any[] = [];
  teamContacts : any[] = [];

  selectedContact: any = null;

  currentTab: 'clients' | 'agents' | 'team' = 'clients';
  searchQuery = '';
  loading = true;
  loadError = false;

  ngOnInit(): void {
    this.loadInteractions();
    this.search.state$.subscribe(({ scope, query }) => {
      this.searchQuery = scope === 'contacts' || scope === 'all' ? query : '';
      if (scope === 'contacts' && this.currentTab !== 'clients') {
        this.currentTab = 'clients';
        this.selectedContact = null;
      }
    });
  }

  loadInteractions(){ // Carrega as interações do arquivo JSON
    this.appData.load().subscribe({
      next: data => {
        this.usersContacts = data.contacts.users;
        this.agentsContacts = data.contacts.agents;
        this.teamContacts = data.contacts.team;
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
        this.usersContacts = data.contacts.users;
        this.agentsContacts = data.contacts.agents;
        this.teamContacts = data.contacts.team;
        this.loading = false;
        this.loadError = false;
      },
      error: () => { this.loading = false; this.loadError = true; }
    });
  }

  setTab(tab: 'clients' | 'agents' | 'team'){
    this.currentTab = tab;
    this.selectedContact = null;
  }

  get currentContacts(): any[] {
    switch (this.currentTab){
      case 'agents':
        return this.agentsContacts;

      case 'team':
        return this.teamContacts;

      default:
        return this.usersContacts;
    }
  }

  get filteredContacts(): any[] {
    const query = this.normalize(this.searchQuery);
    if (!query) return this.currentContacts;

    return this.currentContacts.filter(contact =>
      [contact.nome, contact.email, contact.numero_de_tel, contact.location, contact.type]
        .some(value => this.normalize(value).includes(query))
    );
  }

  get premiumContacts(): number {
    return this.usersContacts.filter(contact => contact.type === 'premium').length;
  }

  get newContacts(): number {
    return this.usersContacts.filter(contact => contact.type === 'novo').length;
  }

  private normalize(value: unknown): string {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  getStars(rating: number){
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++){
      stars.push('full');
    }

    if (hasHalfStar){
      stars.push('half');
    }

    while (stars.length < 5){
      stars.push('empty');
    }

    return stars;
  }

  selectContact(contact: any){
    this.selectedContact = contact;
  }
}
