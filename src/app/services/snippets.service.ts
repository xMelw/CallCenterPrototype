import { Injectable, signal } from '@angular/core';

export interface Snippet {
  id: string;
  title: string;
  body: string;
  shortcut: string;
}

const STORAGE_KEY = 'agent-snippets';

const DEFAULT_SNIPPETS: Snippet[] = [
  {
    id: crypto.randomUUID(),
    title: 'Saudação inicial',
    body: 'Olá! Obrigado por contactar o nosso suporte. Em que posso ajudar hoje?',
    shortcut: '/saudacao',
  },
  {
    id: crypto.randomUUID(),
    title: 'A verificar informação',
    body: 'Um momento, por favor, vou verificar essa informação para si.',
    shortcut: '/verificar',
  },
  {
    id: crypto.randomUUID(),
    title: 'Encerramento',
    body: 'Fico feliz por ter ajudado. Tenha um ótimo dia!',
    shortcut: '/fim',
  },
];

@Injectable({ providedIn: 'root' })
export class SnippetsService {
  readonly snippets = signal<Snippet[]>(this.loadFromStorage());

  add(snippet: Omit<Snippet, 'id'>): void {
    const newSnippet: Snippet = { ...snippet, id: crypto.randomUUID() };
    this.snippets.update((list) => [...list, newSnippet]);
    this.persist();
  }

  update(id: string, changes: Partial<Omit<Snippet, 'id'>>): void {
    this.snippets.update((list) =>
      list.map((s) => (s.id === id ? { ...s, ...changes } : s))
    );
    this.persist();
  }

  remove(id: string): void {
    this.snippets.update((list) => list.filter((s) => s.id !== id));
    this.persist();
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.snippets()));
  }

  private loadFromStorage(): Snippet[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignora erros de parsing e usa defaults
    }
    return DEFAULT_SNIPPETS;
  }
}