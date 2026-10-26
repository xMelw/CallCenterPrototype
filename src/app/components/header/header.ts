import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  constructor(private http: HttpClient) {}

  userName = 'Agente';
  userStatus = 'available';
  activeCount = 0;
  pendingCount = 0;
  closedCount = 0;

  ngOnInit(): void {
    this.http.get<any>('assets/db.json').subscribe(data => {
      this.userName = data.user?.nome ?? this.userName;
      this.userStatus = data.user?.status ?? this.userStatus;
      const customers = data.interactions?.clientes ?? [];
      this.activeCount = customers.filter((customer: any) => customer.customer_status === 'active').length;
      this.pendingCount = customers.filter((customer: any) => customer.customer_status === 'urgent').length;
      this.closedCount = customers.filter((customer: any) => customer.customer_status === 'resolved').length;
    });
  }
}
