import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ThemeService } from '../../services/Theme.service';
import {
 TranslationService,
 SUPPORTED_LANGUAGES,
 SupportedLang,
} from '../../services/translation.service';
import { SnippetsService, Snippet } from '../../services/snippets.service';

type SettingsTab = 'general' | 'snippets' | 'notifications' | 'audio';

interface NotificationPrefs {
 newCall: boolean;
 newChat: boolean;
 queueAlert: boolean;
 sound: boolean;
 desktop: boolean;
 email: boolean;
}

interface AudioPrefs {
 micId: string;
 speakerId: string;
 ringtone: string;
 autoAnswer: boolean;
 noiseSuppression: boolean;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})

export class Settings implements OnInit {

 private readonly storageKey = 'callcenter-agent-settings';

 readonly langs = SUPPORTED_LANGUAGES;
 readonly tabs: { id: SettingsTab; labelKey: string; icon: string }[] = [
 { id: 'general', labelKey: 'tabGeneral', icon: 'settings' },
 { id: 'snippets', labelKey: 'tabSnippets', icon: 'message' },
 { id: 'notifications', labelKey: 'tabNotifications', icon: 'bell' },
 { id: 'audio', labelKey: 'tabAudio', icon: 'audio' },
 ];

 readonly activeTab = signal<SettingsTab>('general');

 // --- Estado: status do agente ---
 readonly agentStatus = signal<'available' | 'away' | 'busy'>('available');

 // --- Estado: notificações ---
 readonly notifPrefs = signal<NotificationPrefs>({
 newCall: true,
 newChat: true,
 queueAlert: false,
 sound: true,
 desktop: true,
 email: false,
 });

 // --- Estado: áudio ---
 readonly audioPrefs = signal<AudioPrefs>({
 micId: 'default',
 speakerId: 'default',
 ringtone: 'classic',
 autoAnswer: false,
 noiseSuppression: true,
 });

 // --- Estado: snippets (formulário) ---
 readonly isSnippetFormOpen = signal(false);
 readonly editingSnippetId = signal<string | null>(null);
 readonly snippetForm = signal<{ title: string; body: string; shortcut: string }>({
 title: '',
 body: '',
 shortcut: '',
 });
 readonly snippetError = signal('');

 readonly toastVisible = signal(false);
 readonly toastMessage = signal('');

 readonly currentLangLabel = computed(() => {
 const lang = this.langs.find((l) => l.code === this.translation.currentLang());
 return lang ? `${lang.flag} ${lang.label}` : '';
 });

 constructor(
 public theme: ThemeService,
 public translation: TranslationService,
 public snippetsSvc: SnippetsService
 ) {}

 ngOnInit(): void {
   try {
     const saved = JSON.parse(localStorage.getItem(this.storageKey) ?? '{}');
     if (['available', 'away', 'busy'].includes(saved.agentStatus)) this.agentStatus.set(saved.agentStatus);
     if (saved.notifications && typeof saved.notifications === 'object') {
       this.notifPrefs.set({ ...this.notifPrefs(), ...saved.notifications });
     }
     if (saved.audio && typeof saved.audio === 'object') {
       this.audioPrefs.set({ ...this.audioPrefs(), ...saved.audio });
     }
   } catch {
     // Invalid or unavailable browser storage keeps the safe defaults.
   }
 }

 t(key: string): string {
 return this.translation.translate(key);
 }

 // --- Navegação por tabs ---
 setTab(tab: SettingsTab): void {
 this.activeTab.set(tab);
 }

 // --- Idioma ---
 async onLanguageChange(lang: SupportedLang): Promise<void> {
 await this.translation.setLanguage(lang);
 }

 // --- Dark mode ---
 toggleTheme(): void {
 this.theme.toggle();
 }

 // --- Status ---
 setStatus(status: 'available' | 'away' | 'busy'): void {
 this.agentStatus.set(status);
 }

 // --- Notificações ---
 toggleNotif(key: keyof NotificationPrefs): void {
 this.notifPrefs.update((prefs) => ({ ...prefs, [key]: !prefs[key] }));
 }

 // --- Áudio ---
 updateAudioField<K extends keyof AudioPrefs>(field: K, value: AudioPrefs[K]): void {
 this.audioPrefs.update((prefs) => ({ ...prefs, [field]: value }));
 }

 toggleAutoAnswer(): void {
 this.audioPrefs.update((p) => ({ ...p, autoAnswer: !p.autoAnswer }));
 }

 toggleNoiseSuppression(): void {
 this.audioPrefs.update((p) => ({ ...p, noiseSuppression: !p.noiseSuppression }));
 }

 async testAudio(): Promise<void> {
   const AudioContextConstructor = window.AudioContext;
   if (!AudioContextConstructor) {
     this.showToast('Este navegador não suporta áudio de teste.');
     return;
   }
   try {
     const context = new AudioContextConstructor();
     const oscillator = context.createOscillator();
     const gain = context.createGain();
     const frequencies: Record<string, number> = { classic: 660, chime: 880, digital: 520 };
     oscillator.type = this.audioPrefs().ringtone === 'digital' ? 'square' : 'sine';
     oscillator.frequency.value = frequencies[this.audioPrefs().ringtone] ?? 660;
     gain.gain.setValueAtTime(0, context.currentTime);
     gain.gain.linearRampToValueAtTime(0.12, context.currentTime + 0.04);
     gain.gain.setValueAtTime(0.12, context.currentTime + 0.22);
     gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.32);
     oscillator.connect(gain);
     gain.connect(context.destination);
     oscillator.start();
     oscillator.stop(context.currentTime + 0.34);
     oscillator.onended = () => void context.close();
     this.showToast('A reproduzir som de teste.');
   } catch {
     this.showToast('Não foi possível reproduzir o som de teste.');
   }
 }

 // --- Snippets CRUD ---
 openNewSnippetForm(): void {
 this.snippetError.set('');
 this.editingSnippetId.set(null);
 this.snippetForm.set({ title: '', body: '', shortcut: '' });
 this.isSnippetFormOpen.set(true);
 }

 openEditSnippetForm(snippet: Snippet): void {
 this.snippetError.set('');
 this.editingSnippetId.set(snippet.id);
 this.snippetForm.set({
 title: snippet.title,
 body: snippet.body,
 shortcut: snippet.shortcut,
 });
 this.isSnippetFormOpen.set(true);
 }

 closeSnippetForm(): void {
 this.isSnippetFormOpen.set(false);
 this.editingSnippetId.set(null);
 this.snippetError.set('');
 }

 saveSnippet(): void {
 const form = this.snippetForm();
 const title = form.title.trim();
 const body = form.body.trim();
 const shortcut = this.normalizeShortcut(form.shortcut || title);
 if (!title || !body) {
   this.snippetError.set('Indique um título e o texto da resposta.');
   return;
 }
 if (shortcut.length < 2 || !/^\/[a-z0-9_-]+$/.test(shortcut)) {
   this.snippetError.set('Use um atalho simples, como /bomdia.');
   return;
 }

 const editingId = this.editingSnippetId();
 if (this.snippetsSvc.snippets().some(item => item.id !== editingId && item.shortcut.toLowerCase() === shortcut)) {
   this.snippetError.set('Este atalho já está a ser utilizado. Escolha outro.');
   return;
 }
 if (editingId) {
 this.snippetsSvc.update(editingId, { title, body, shortcut });
 } else {
 this.snippetsSvc.add({ title, body, shortcut });
 }
 this.closeSnippetForm();
 this.showToast(' Resposta rápida guardada.');
 }

 deleteSnippet(id: string): void {
 this.snippetsSvc.remove(id);
 }

 updateSnippetFormField(field: 'title' | 'body' | 'shortcut', value: string): void {
 this.snippetForm.update((f) => ({ ...f, [field]: value }));
 this.snippetError.set('');
 }

 private normalizeShortcut(value: string): string {
   const slug = value.trim().toLowerCase().replace(/^\/+/, '').replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '');
   return slug ? `/${slug}` : '';
 }

 // --- Guardar tudo ---
 saveAll(): void {
   try {
     localStorage.setItem(this.storageKey, JSON.stringify({
       agentStatus: this.agentStatus(),
       notifications: this.notifPrefs(),
       audio: this.audioPrefs(),
     }));
     window.dispatchEvent(new CustomEvent('agent-settings-saved', { detail: { status: this.agentStatus() } }));
   } catch {
     this.showToast('Não foi possível guardar as definições neste navegador.');
     return;
   }
 this.showToast(this.t('savedToast') || 'Definições guardadas com sucesso.');
 }

 private showToast(message: string): void {
 this.toastMessage.set(message);
 this.toastVisible.set(true);
 setTimeout(() => this.toastVisible.set(false), 2500);
 }
}
