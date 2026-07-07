import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

/**
 * Idiomas suportados pela página de Settings.
 * NOTA: Os itens do menu principal da aplicação NÃO são afetados por este serviço,
 * apenas o conteúdo desta página (labels, descrições, textos de ajuda, etc).
 */
export type SupportedLang = 'EN' | 'PT-PT' | 'ES';

export interface LangOption {
  code: SupportedLang;
  label: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LangOption[] = [
  { code: 'EN', label: 'English', flag: '🇬🇧' },
  { code: 'PT-PT', label: 'Português', flag: '🇵🇹' },
  { code: 'ES', label: 'Español', flag: '🇪🇸' },
];

/**
 * Textos-base da página de Settings (idioma de origem: Português).
 * Estas chaves são as únicas traduzidas via DeepL — o menu principal
 * da aplicação fica fora do âmbito deste serviço.
 */
export const SETTINGS_SOURCE_STRINGS: Record<string, string> = {
  pageTitle: 'Definições',
  pageSubtitle: 'Personalize a sua experiência de agente de call center.',

  tabGeneral: 'Geral',
  tabSnippets: 'Respostas Rápidas',
  tabNotifications: 'Notificações',
  tabAudio: 'Áudio',

  langSectionTitle: 'Idioma da Página',
  langSectionDesc: 'Escolha o idioma de apresentação desta página de definições.',

  themeSectionTitle: 'Aparência',
  themeSectionDesc: 'Alterne entre modo claro e escuro.',
  themeLight: 'Claro',
  themeDark: 'Escuro',

  statusSectionTitle: 'Estado do Agente',
  statusSectionDesc: 'Defina a sua disponibilidade predefinida ao iniciar sessão.',
  statusAvailable: 'Disponível',
  statusAway: 'Ausente',
  statusBusy: 'Ocupado',

  snippetsSectionTitle: 'Gestão de Respostas Rápidas',
  snippetsSectionDesc: 'Crie e organize respostas pré-definidas para agilizar o atendimento.',
  snippetAddBtn: 'Adicionar Resposta',
  snippetTitlePlaceholder: 'Título da resposta',
  snippetBodyPlaceholder: 'Texto da resposta...',
  snippetShortcutPlaceholder: 'Atalho (ex: /saudacao)',
  snippetSave: 'Guardar',
  snippetCancel: 'Cancelar',
  snippetDelete: 'Eliminar',
  snippetEdit: 'Editar',
  snippetEmpty: 'Ainda não existem respostas rápidas. Adicione a primeira.',

  notifSectionTitle: 'Notificações',
  notifSectionDesc: 'Escolha como e quando ser notificado.',
  notifNewCall: 'Nova chamada recebida',
  notifNewChat: 'Nova conversa de chat',
  notifQueueAlert: 'Alerta de fila com espera elevada',
  notifSound: 'Som de notificação',
  notifDesktop: 'Notificações no ambiente de trabalho',
  notifEmail: 'Resumo diário por email',

  audioSectionTitle: 'Áudio e Dispositivos',
  audioSectionDesc: 'Configure o microfone, altifalantes e comportamento de chamada.',
  audioMic: 'Microfone',
  audioSpeaker: 'Altifalante',
  audioRingtone: 'Toque de chamada',
  audioAutoAnswer: 'Atender chamadas automaticamente',
  audioNoiseSuppression: 'Supressão de ruído de fundo',
  audioTestBtn: 'Testar Áudio',

  saveAllBtn: 'Guardar Definições',
  savedToast: 'Definições guardadas com sucesso.',
};

@Injectable({ providedIn: 'root' })
export class TranslationService {
  /** Idioma atualmente selecionado para a página de Settings. */
  readonly currentLang = signal<SupportedLang>('PT-PT');

  /** Mapa de strings traduzidas, disponível à template via translate(). */
  readonly strings = signal<Record<string, string>>({ ...SETTINGS_SOURCE_STRINGS });

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  // Cache em memória para evitar chamadas repetidas à API.
  private cache = new Map<SupportedLang, Record<string, string>>();

  /**
   * Endpoint do backend próprio que faz proxy seguro para a API DeepL
   * (a chave da DeepL NUNCA deve ser exposta no frontend).
   * Ajustar para o endpoint real do backend.
   */
  private readonly proxyEndpoint = '/api/translate/deepl';

  constructor(private http: HttpClient) {
    this.cache.set('PT-PT', { ...SETTINGS_SOURCE_STRINGS });
  }

  translate(key: string): string {
    return this.strings()[key] ?? key;
  }

  async setLanguage(lang: SupportedLang): Promise<void> {
    if (lang === this.currentLang()) return;

    this.error.set(null);

    if (this.cache.has(lang)) {
      this.currentLang.set(lang);
      this.strings.set(this.cache.get(lang)!);
      return;
    }

    if (lang === 'PT-PT') {
      this.currentLang.set(lang);
      this.strings.set({ ...SETTINGS_SOURCE_STRINGS });
      return;
    }

    this.isLoading.set(true);
    try {
      const keys = Object.keys(SETTINGS_SOURCE_STRINGS);
      const texts = Object.values(SETTINGS_SOURCE_STRINGS);

      // Chamada ao backend próprio (que por sua vez chama a API DeepL).
      // Corpo esperado pelo proxy: { text: string[], target_lang: 'EN'|'ES'|'PT-PT', source_lang: 'PT' }
      const response = await firstValueFrom(
        this.http.post<{ translations: { text: string }[] }>(this.proxyEndpoint, {
          text: texts,
          target_lang: lang,
          source_lang: 'PT',
        })
      );

      const translated: Record<string, string> = {};
      keys.forEach((key, i) => {
        translated[key] = response.translations[i]?.text ?? SETTINGS_SOURCE_STRINGS[key];
      });

      this.cache.set(lang, translated);
      this.strings.set(translated);
      this.currentLang.set(lang);
    } catch (e) {
      console.error('Falha ao traduzir via DeepL:', e);
      this.error.set('Não foi possível traduzir a página. A repor idioma anterior.');
      // Mantém o idioma anterior em caso de falha, não muda currentLang.
    } finally {
      this.isLoading.set(false);
    }
  }
}