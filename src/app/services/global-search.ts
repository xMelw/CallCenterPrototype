import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SearchScope = 'all' | 'inbox' | 'contacts' | 'history' | 'knowledge';

export interface SearchState {
  scope: SearchScope;
  query: string;
}

@Injectable({ providedIn: 'root' })
export class GlobalSearchService {
  private readonly state = new BehaviorSubject<SearchState>({ scope: 'all', query: '' });
  readonly state$ = this.state.asObservable();

  update(scope: SearchScope, query: string): void {
    this.state.next({ scope, query: query.trim() });
  }
}
