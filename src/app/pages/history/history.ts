import { Component } from '@angular/core';
import { DataList } from '../../components/data-list/data-list';
import { HttpClient } from '@angular/common/http';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-history',
  imports: [DataList, NgClass],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History {

  constructor(
    private http: HttpClient
  ){}

  selectedCall: any = null;
  callHistory : any[] = [];
  currentPage = 1;
  itemsPerPage = 5;

  ngOnInit(): void {
    this.loadInteractions();
  }

  loadInteractions(){ // Carrega as interações do arquivo JSON
    this.http.get<any>('assets/db.json').subscribe(data => {
      this.callHistory = [...data.history].sort((a: any, b: any) =>
        new Date(b.data_hora.replace(' ', 'T')).getTime() - new Date(a.data_hora.replace(' ', 'T')).getTime()
      );
    });
  }

  selectCall(call: any){
    this.selectedCall = call;
  }

   // ----- Paginação -----

   get currentHistory(): any[] {
    return this.callHistory;
  }

  get totalPages(): number {
    return Math.ceil(this.currentHistory.length / this.itemsPerPage);
  }

  get paginatedHistory(){
    const start = (this.currentPage - 1) * this.itemsPerPage;

    return this.currentHistory.slice(start, start + this.itemsPerPage);
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
}
