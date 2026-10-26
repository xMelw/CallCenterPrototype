import { Component, Input } from '@angular/core';
import { DataList } from "../../components/data-list/data-list";
import { HttpClient } from '@angular/common/http';
import { MenuService } from '../../services/menu';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-contacts',
  imports: [DataList, NgClass],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css',
})
export class Contacts {

  constructor(
    private http: HttpClient, //Obtem os dados do JSON
    private menuService: MenuService
  ){}

  usersContacts : any[] = [];
  agentsContacts : any[] = [];
  teamContacts : any[] = [];

  selectedContact: any = null;

  currentTab: 'clients' | 'agents' | 'team' = 'clients'
  currentPage = 1;
  itemsPerPage = 8;

  ngOnInit(): void {
    this.loadInteractions();

    this.menuService.collapsed$.subscribe(collapsed => {
      this.itemsPerPage =
        collapsed ? 10 : 8; // !collapsed : collapsed
    })
  }

  loadInteractions(){ // Carrega as interações do arquivo JSON
    this.http.get<any>('assets/db.json').subscribe(data => {
      this.usersContacts = data.contacts.users;
      this.agentsContacts = data.contacts.agents;
      this.teamContacts = data.contacts.team;

    });
  }

  setTab(tab: 'clients' | 'agents' | 'team'){
    this.currentTab = tab;
    this.currentPage = 1;
  }

  get currentContacts(): any[] {
    switch (this.currentTab){
      case 'agents':
        return this.agentsContacts;

      case 'team':
        return this.teamContacts;

      default:
        return this.usersContacts;
    }
  }

  // ----- Paginação -----
  get totalPages(): number {
    return Math.ceil(this.currentContacts.length / this.itemsPerPage);
  }

  get paginatedContacts(){
    const start = (this.currentPage - 1) * this.itemsPerPage;

    return this.currentContacts.slice(start, start + this.itemsPerPage);
  }

  get pages(): number[]{
    return Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    );
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  nextPage(){
    if (this.currentPage < this.totalPages){
      this.currentPage++;
    }
  }

  previousPage(){
    if (this.currentPage > 1){
      this.currentPage--;
    }
  }

  firstPage(){
    this.currentPage = 1;
  }

  lastPage(){
    this.currentPage = this.totalPages;
  }

  // ----------

  getStars(rating: number){
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++){
      stars.push('full');
    }

    if (hasHalfStar){
      stars.push('half');
    }

    while (stars.length < 5){
      stars.push('empty');
    }

    return stars;
  }

  selectContact(contact: any){
    this.selectedContact = contact;
  }
}
