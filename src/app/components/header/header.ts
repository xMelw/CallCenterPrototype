import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { GlobalSearchService, SearchScope } from '../../services/global-search';
import { AppDataService } from '../../services/app-data';

@Component({
  selector: 'app-header',
  imports: [FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  constructor(
    private appData: AppDataService,
    private router: Router,
    private search: GlobalSearchService
  ) {}

  userName = 'Agente';
  userStatus = 'available';
  activeCount = 0;
  pendingCount = 0;
  closedCount = 0;
  searchScope: SearchScope = 'all';
  searchQuery = '';

  get userStatusLabel(): string {
    return ({ available: 'Disponível', 'disponível': 'Disponível', away: 'Em pausa', 'em pausa': 'Em pausa', busy: 'Ocupado', ocupado: 'Ocupado' } as Record<string, string>)[this.userStatus] ?? 'Disponível';
  }

  private readonly onSettingsSaved = (event: Event) => {
    const status = (event as CustomEvent<{ status?: string }>).detail?.status;
    if (status === 'available' || status === 'away' || status === 'busy') this.userStatus = status;
  };

  private readonly routes: Partial<Record<SearchScope, string>> = {
    inbox: '/inbox',
    contacts: '/contacts',
    history: '/history',
    knowledge: '/knowledge'
  };

  ngOnInit(): void {
    if (typeof window !== 'undefined') window.addEventListener('agent-settings-saved', this.onSettingsSaved);
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        const route = event.urlAfterRedirects.split('?')[0];
        const activeScope = (Object.entries(this.routes).find(([, path]) => path === route)?.[0] as SearchScope | undefined) ?? 'all';
        if (activeScope !== this.searchScope) {
          this.searchScope = activeScope;
          this.searchQuery = '';
          this.search.update(activeScope, '');
        }
      });

    this.appData.load().subscribe(data => {
      this.userName = data.user?.nome ?? this.userName;
      this.userStatus = data.user?.status ?? this.userStatus;
      try {
        const saved = JSON.parse(localStorage.getItem('callcenter-agent-settings') ?? '{}');
        if (['available', 'away', 'busy'].includes(saved.agentStatus)) this.userStatus = saved.agentStatus;
      } catch { /* Keep the status from the application data. */ }
      const customers = data.interactions?.clientes ?? [];
      this.activeCount = customers.filter((customer: any) => customer.customer_status === 'ativo').length;
      this.pendingCount = customers.filter((customer: any) => customer.customer_status === 'urgente').length;
      this.closedCount = customers.filter((customer: any) => customer.customer_status === 'resolvido').length;
    });
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') window.removeEventListener('agent-settings-saved', this.onSettingsSaved);
  }

  onSearchChange(): void {
    this.search.update(this.searchScope, this.searchQuery);

    const route = this.routes[this.searchScope];
    if (this.searchQuery.trim() && route && this.router.url.split('?')[0] !== route) {
      void this.router.navigateByUrl(route);
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.onSearchChange();
  }
}
