import { Component, Output, EventEmitter } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgClass } from '@angular/common';
import { MenuService } from '../../services/menu';
import { AppDataService } from '../../services/app-data';

import { Recents } from '../recents/recents';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [NgClass, Recents],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {

  constructor(
    private appData: AppDataService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private menuService: MenuService
  ){}

  isMobile = false;
  isCollapsed = false; // Inicializa como falso, ou seja "aberto"

  menuItems : any[] = []; // Armazena os itens do menu carregados do JSON
  menuLink : string = 'home';

  @Output() collapsedChange = new EventEmitter<boolean>(); // Emite o estado de colapso para o componente "pai"


  ngOnInit(){ // Carrega os itens do menu a partir do arquivo JSON
    this.appData.load().subscribe(data => {
      this.menuItems = data.menu.links;
    });

    this.breakpointObserver //Observa para detetar de que tipo de ecrã é que se trata
    .observe([
      Breakpoints.Handset,  // Telemóveis
      Breakpoints.Tablet,   // Tablets
      '(max-width: 1366px)' // Laptops pequenos e ecrãs médios
    ])
    .subscribe(result =>{
      this.isMobile = this.breakpointObserver.isMatched(Breakpoints.Handset);
      this.isCollapsed = result.matches;
      this.collapsedChange.emit(this.isCollapsed);
      this.menuService.collapsed$.next(this.isCollapsed);
    });
  }

  toggle() { // Alterna o estado de colapso do menu
    this.isCollapsed = !this.isCollapsed;
    this.collapsedChange.emit(this.isCollapsed); // Emite o estado de colapso
    this.menuService.collapsed$.next(this.isCollapsed);
  }

  setActive(selectedItem: any){ // Define o item selecionado como ativo e desativa os outros
    this.menuItems.forEach(item => {
      item.active = false;
    });
    selectedItem.active = true;
    this.menuLink = selectedItem.title;
  }

  getActive(): string{
    return this.menuLink;
  }

  navigate(route: string, event: MouseEvent): void {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (this.router.url.split('?')[0] !== route) {
      void this.router.navigateByUrl(route);
    }
  }

  isRouteActive(route: string): boolean {
    return this.router.isActive(route, {
      paths: 'exact',
      queryParams: 'ignored',
      matrixParams: 'ignored',
      fragment: 'ignored'
    });
  }

}
