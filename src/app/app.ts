import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Menu } from './components/menu/menu';
import { Header } from './components/header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Menu, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('CallCenterPrototype');

  constructor(
    private http: HttpClient, //Obtem os dados do JSON
  ){}

  users: any[] = [];
  isCollasped = false; // Variavél para controlar o estado de colapso do componente menu

  ngOnInit() {
    this.http.get<any[]>('assets/db.json').subscribe(data => {
      this.users = data;
    });
  
  }

  onCollapsedChange(collapsed: boolean){ // Metodo para atualizar o estado de colapso
    this.isCollasped = collapsed;
  }
}
