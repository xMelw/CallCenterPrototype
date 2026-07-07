import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Menu } from '../menu/menu';

@Component({
  selector: 'app-recents',
  standalone: true,
  imports: [],
  templateUrl: './recents.html',
  styleUrl: './recents.css',
})

export class Recents {

  constructor(
    private http: HttpClient, //Obtem os dados do JSON
    public menu: Menu,
  ){}

  @Input() getActive!: () => string;
  @Input() isCollapsed!: boolean;

  atualRecents : any[] = []; // Obtem os clientes pela função getMsgCalls;
  recentsCalls : any[] = []; // Armazena os itens das Calls Recentes carregados do JSON
  recentsMsg : any[] = []; // Armazena os itens das Mensagens Recentes carregados do JSON

  @ViewChild('container') container!: ElementRef;
  maxItems : number = 0; // Numero máximo que cabe de "recents-cards" no "recent-main"

  ngOnInit(){ // Carrega os itens do menu a partir do arquivo JSON
    this.http.get<any>('assets/db.json')
    .subscribe(data => {
      this.recentsCalls = data.menu.recents.recent_call;
      this.recentsMsg = data.menu.recents.recent_msg;
      this.verifyRecents(); //Invoca a função já de inicios
    });
  }

  ngOnChanges(){
    this.verifyRecents(); // Muda conforme o link Ativo do menu
  }

  // ngAfterViewInit(){
  //   const heightContainer = this.container.nativeElement.offsetHeight;
  //   const heightItem = 65;

  //   this.maxItems = Math.floor(heightContainer / heightItem);
  // }

  verifyRecents() {
    if (this.getActive() === 'INBOX'){
      this.atualRecents = this.recentsMsg;
    } else {
        this.atualRecents = this.recentsCalls;
    }
  }

  getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high':
      return '2px solid #ff4b4b';
    case 'medium':
      return '2px solid #ffd13d';
    case 'low':
      return '2px solid #8ce95c';
    case 'neutral':
      return '2px solid #9ca8ba';
    default:
      return '2px solid #9ca8ba';
  }
}

}
