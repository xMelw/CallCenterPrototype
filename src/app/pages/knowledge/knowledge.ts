import { Component, OnInit } from '@angular/core';
import { GlobalSearchService } from '../../services/global-search';
import { AppDataService } from '../../services/app-data';

@Component({
  selector: 'app-knowledge',
  standalone: true,
  imports: [],
  templateUrl: './knowledge.html',
  styleUrl: './knowledge.css',
})
export class Knowledge implements OnInit {
  constructor(
    private appData: AppDataService,
    private search: GlobalSearchService
  ) {}

  articles: any[] = [];
  activeCategory = 'Todas';
  selectedArticle: any = null;
  searchQuery = '';
  loading = true;
  loadError = false;

  ngOnInit(): void {
    this.loadArticles();

    this.search.state$.subscribe(({ scope, query }) => {
      this.searchQuery = scope === 'knowledge' || scope === 'all' ? query : '';
      if (scope === 'knowledge' && query) {
        this.selectedArticle = null;
        this.activeCategory = 'Todas';
      }
    });
  }

  loadArticles(): void {
    this.appData.load().subscribe({
      next: data => {
        this.articles = data.knowledge ?? [];
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
        this.articles = data.knowledge ?? [];
        this.loading = false;
        this.loadError = false;
      },
      error: () => {
        this.loading = false;
        this.loadError = true;
      }
    });
  }

  get categories(): string[] {
    return ['Todas', ...new Set(this.articles.map(article => article.category))];
  }

  get filteredArticles(): any[] {
    const query = this.normalize(this.searchQuery);
    return this.articles.filter(article => {
      const matchesCategory = this.activeCategory === 'Todas' || article.category === this.activeCategory;
      const searchable = [article.title, article.category, article.summary, ...(article.tags ?? []),
        ...(article.sections ?? []).flatMap((section: any) => [section.heading, section.text])]
        .map(value => this.normalize(value)).join(' ');
      return matchesCategory && (!query || searchable.includes(query));
    });
  }

  openArticle(article: any): void {
    this.selectedArticle = article;
  }

  showArticles(): void {
    this.selectedArticle = null;
  }

  private normalize(value: unknown): string {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
