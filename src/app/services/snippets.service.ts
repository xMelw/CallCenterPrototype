import { Injectable, signal } from '@angular/core';

export interface Snippet {
  id: string;
  title: string;
  body: string;
  shortcut: string;
}

const STORAGE_KEY = 'agent-snippets';
const MIGRATION_KEY = 'agent-snippets-v2-migrated';

const DEFAULT_SNIPPETS: Snippet[] = [
  {
    id: 'default-bomdia',
    title: 'Saudação de bom dia',
    body: 'Bom dia! Obrigado por contactar o nosso suporte. Como posso ajudar?',
    shortcut: '/bomdia',
  },
  {
    id: 'default-saudacao',
    title: 'Saudação inicial',
    body: 'Olá! Obrigado por contactar o nosso suporte. Em que posso ajudar hoje?',
    shortcut: '/saudacao',
  },
  {
    id: 'default-verificar',
    title: 'A verificar informação',
    body: 'Um momento, por favor, vou verificar essa informação para si.',
    shortcut: '/verificar',
  },
  {
    id: 'default-encerramento',
    title: 'Encerramento',
    body: 'Fico feliz por ter ajudado. Tenha um ótimo dia!',
    shortcut: '/fim',
  },
];

function createId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `snippet-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

@Injectable({ providedIn: 'root' })
export class SnippetsService {
  readonly snippets = signal<Snippet[]>(this.loadFromStorage());

  add(snippet: Omit<Snippet, 'id'>): void {
    const newSnippet: Snippet = { ...snippet, id: createId() };
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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.snippets()));
      localStorage.setItem(MIGRATION_KEY, 'true');
    } catch {
      // Keep the in-memory list available when browser storage is blocked.
    }
  }

  private loadFromStorage(): Snippet[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved: unknown = JSON.parse(raw);
        if (Array.isArray(saved)) {
          if (localStorage.getItem(MIGRATION_KEY) === 'true') return saved as Snippet[];
          const byShortcut = new Map(DEFAULT_SNIPPETS.map(snippet => [snippet.shortcut.toLowerCase(), snippet]));
          for (const item of saved) {
            if (item && typeof item.title === 'string' && typeof item.body === 'string' && typeof item.shortcut === 'string') {
              byShortcut.set(item.shortcut.toLowerCase(), item as Snippet);
            }
          }
          localStorage.setItem(MIGRATION_KEY, 'true');
          return [...byShortcut.values()];
        }
      }
    } catch {
      // ignora erros de parsing e usa defaults
    }
    return DEFAULT_SNIPPETS;
  }
}
