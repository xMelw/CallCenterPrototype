import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'agent-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly document = inject(DOCUMENT);
  readonly theme = signal<ThemeMode>(this.getInitialTheme());

  constructor() {
    // Aplica a classe 'dark' no <html> sempre que o sinal muda,
    // usando o mecanismo nativo de dark mode do Tailwind (darkMode: 'class').
    effect(() => {
      if (!this.isBrowser) return;

      const root = this.document.documentElement;
      if (this.theme() === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      try {
        window.localStorage.setItem(STORAGE_KEY, this.theme());
      } catch {
        // O tema continua funcional mesmo quando o armazenamento está indisponível.
      }
    });
  }

  toggle(): void {
    this.theme.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  setTheme(mode: ThemeMode): void {
    this.theme.set(mode);
  }

  private getInitialTheme(): ThemeMode {
    if (!this.isBrowser) return 'light';

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // Usa a preferência do sistema se o armazenamento não estiver acessível.
    }

    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
}
