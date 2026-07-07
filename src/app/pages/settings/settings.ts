import { Component, signal, computed } from '@angular/core';
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

export class Settings {

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

 testAudio(): void {
 this.showToast(' A reproduzir som de teste...');
 }

 // --- Snippets CRUD ---
 openNewSnippetForm(): void {
 this.editingSnippetId.set(null);
 this.snippetForm.set({ title: '', body: '', shortcut: '' });
 this.isSnippetFormOpen.set(true);
 }

 openEditSnippetForm(snippet: Snippet): void {
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
 }

 saveSnippet(): void {
 const form = this.snippetForm();
 if (!form.title.trim() || !form.body.trim()) return;

 const editingId = this.editingSnippetId();
 if (editingId) {
 this.snippetsSvc.update(editingId, form);
 } else {
 this.snippetsSvc.add(form);
 }
 this.closeSnippetForm();
 this.showToast(' Resposta rápida guardada.');
 }

 deleteSnippet(id: string): void {
 this.snippetsSvc.remove(id);
 }

 updateSnippetFormField(field: 'title' | 'body' | 'shortcut', value: string): void {
 this.snippetForm.update((f) => ({ ...f, [field]: value }));
 }

 // --- Guardar tudo ---
 saveAll(): void {
 // Aqui entraria a chamada real ao backend para persistir as definições.
 this.showToast(this.t('savedToast') || 'Definições guardadas com sucesso.');
 }

 private showToast(message: string): void {
 this.toastMessage.set(message);
 this.toastVisible.set(true);
 setTimeout(() => this.toastVisible.set(false), 2500);
 }
}