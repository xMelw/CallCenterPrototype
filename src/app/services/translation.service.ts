import { Injectable, signal } from '@angular/core';

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
  snippetUseHint: 'No Inbox, escreva / no campo da mensagem. Escolha uma resposta ou prima Tab para a inserir no rascunho.',

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

const ENGLISH_STRINGS: Record<string, string> = {
  pageTitle: 'Settings', pageSubtitle: 'Personalize your call center agent experience.',
  tabGeneral: 'General', tabSnippets: 'Quick replies', tabNotifications: 'Notifications', tabAudio: 'Audio',
  langSectionTitle: 'Page language', langSectionDesc: 'Choose the display language for this settings page.',
  themeSectionTitle: 'Appearance', themeSectionDesc: 'Switch between light and dark mode.', themeLight: 'Light', themeDark: 'Dark',
  statusSectionTitle: 'Agent status', statusSectionDesc: 'Set your default availability when you sign in.',
  statusAvailable: 'Available', statusAway: 'Away', statusBusy: 'Busy',
  snippetsSectionTitle: 'Quick reply management', snippetsSectionDesc: 'Create and organize saved replies to speed up customer support.',
  snippetAddBtn: 'Add reply', snippetTitlePlaceholder: 'Reply title', snippetBodyPlaceholder: 'Reply text...', snippetShortcutPlaceholder: 'Shortcut (e.g. /greeting)',
  snippetSave: 'Save', snippetCancel: 'Cancel', snippetDelete: 'Delete', snippetEdit: 'Edit', snippetEmpty: 'There are no quick replies yet. Add your first one.',
  snippetUseHint: 'In the Inbox, type / in the message field. Choose a reply or press Tab to insert it into your draft.',
  notifSectionTitle: 'Notifications', notifSectionDesc: 'Choose how and when you want to be notified.',
  notifNewCall: 'New incoming call', notifNewChat: 'New chat conversation', notifQueueAlert: 'High wait time queue alert',
  notifSound: 'Notification sound', notifDesktop: 'Desktop notifications', notifEmail: 'Daily email summary',
  audioSectionTitle: 'Audio and devices', audioSectionDesc: 'Configure your microphone, speakers, and call behavior.',
  audioMic: 'Microphone', audioSpeaker: 'Speaker', audioRingtone: 'Ringtone', audioAutoAnswer: 'Answer calls automatically',
  audioNoiseSuppression: 'Background noise suppression', audioTestBtn: 'Test audio', saveAllBtn: 'Save settings', savedToast: 'Settings saved successfully.',
};

const SPANISH_STRINGS: Record<string, string> = {
  pageTitle: 'Configuración', pageSubtitle: 'Personalice su experiencia como agente de atención al cliente.',
  tabGeneral: 'General', tabSnippets: 'Respuestas rápidas', tabNotifications: 'Notificaciones', tabAudio: 'Audio',
  langSectionTitle: 'Idioma de la página', langSectionDesc: 'Elija el idioma de presentación de esta página de configuración.',
  themeSectionTitle: 'Apariencia', themeSectionDesc: 'Cambie entre el modo claro y oscuro.', themeLight: 'Claro', themeDark: 'Oscuro',
  statusSectionTitle: 'Estado del agente', statusSectionDesc: 'Defina su disponibilidad predeterminada al iniciar sesión.',
  statusAvailable: 'Disponible', statusAway: 'Ausente', statusBusy: 'Ocupado',
  snippetsSectionTitle: 'Gestión de respuestas rápidas', snippetsSectionDesc: 'Cree y organice respuestas guardadas para agilizar la atención.',
  snippetAddBtn: 'Añadir respuesta', snippetTitlePlaceholder: 'Título de la respuesta', snippetBodyPlaceholder: 'Texto de la respuesta...', snippetShortcutPlaceholder: 'Atajo (p. ej. /saludo)',
  snippetSave: 'Guardar', snippetCancel: 'Cancelar', snippetDelete: 'Eliminar', snippetEdit: 'Editar', snippetEmpty: 'Todavía no hay respuestas rápidas. Añada la primera.',
  snippetUseHint: 'En Inbox, escriba / en el campo del mensaje. Elija una respuesta o pulse Tab para insertarla en el borrador.',
  notifSectionTitle: 'Notificaciones', notifSectionDesc: 'Elija cómo y cuándo recibir notificaciones.',
  notifNewCall: 'Nueva llamada entrante', notifNewChat: 'Nueva conversación de chat', notifQueueAlert: 'Alerta de espera elevada en la cola',
  notifSound: 'Sonido de notificación', notifDesktop: 'Notificaciones de escritorio', notifEmail: 'Resumen diario por correo',
  audioSectionTitle: 'Audio y dispositivos', audioSectionDesc: 'Configure el micrófono, los altavoces y el comportamiento de las llamadas.',
  audioMic: 'Micrófono', audioSpeaker: 'Altavoz', audioRingtone: 'Tono de llamada', audioAutoAnswer: 'Responder llamadas automáticamente',
  audioNoiseSuppression: 'Supresión del ruido de fondo', audioTestBtn: 'Probar audio', saveAllBtn: 'Guardar configuración', savedToast: 'Configuración guardada correctamente.',
};

@Injectable({ providedIn: 'root' })
export class TranslationService {
  /** Idioma atualmente selecionado para a página de Settings. */
  readonly currentLang = signal<SupportedLang>('PT-PT');

  /** Mapa de strings traduzidas, disponível à template via translate(). */
  readonly strings = signal<Record<string, string>>({ ...SETTINGS_SOURCE_STRINGS });

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  private readonly dictionaries: Record<SupportedLang, Record<string, string>> = {
    'PT-PT': SETTINGS_SOURCE_STRINGS,
    EN: ENGLISH_STRINGS,
    ES: SPANISH_STRINGS,
  };

  constructor() {
    const stored = this.readStoredLanguage();
    this.currentLang.set(stored);
    this.strings.set(this.dictionaries[stored]);
  }

  translate(key: string): string {
    return this.strings()[key] ?? key;
  }

  async setLanguage(lang: SupportedLang): Promise<void> {
    this.error.set(null);
    this.currentLang.set(lang);
    this.strings.set(this.dictionaries[lang]);
    try { localStorage.setItem('callcenter-settings-language', lang); } catch { /* storage can be unavailable */ }
  }

  private readStoredLanguage(): SupportedLang {
    try {
      const lang = localStorage.getItem('callcenter-settings-language');
      return lang === 'EN' || lang === 'ES' || lang === 'PT-PT' ? lang : 'PT-PT';
    } catch {
      return 'PT-PT';
    }
  }
}
