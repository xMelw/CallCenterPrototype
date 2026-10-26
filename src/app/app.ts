import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from './components/menu/menu';
import { Header } from './components/header/header';
import { AppDataService } from './services/app-data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Menu, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  constructor(private appData: AppDataService) {}

  isCollapsed = false; // Estado de colapso do menu
  dataReady = signal(false);
  dataError = signal(false);

  ngOnInit() {
    this.loadAppData();
  }

  loadAppData(): void {
    this.dataError.set(false);
    this.appData.load().subscribe({
      next: () => this.dataReady.set(true),
      error: () => this.dataError.set(true)
    });
  }

  retryData(): void {
    this.dataReady.set(false);
    this.dataError.set(false);
    this.appData.retry().subscribe({
      next: () => this.dataReady.set(true),
      error: () => this.dataError.set(true)
    });
  }

  onCollapsedChange(collapsed: boolean){ // Metodo para atualizar o estado de colapso
    this.isCollapsed = collapsed;
  }
}
