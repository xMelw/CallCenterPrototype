import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

export interface AppDatabase {
  user: any;
  menu: any;
  contacts: any;
  interactions: any;
  history: any[];
  knowledge: any[];
}

@Injectable({ providedIn: 'root' })
export class AppDataService {
  private request?: Observable<AppDatabase>;

  constructor(private http: HttpClient) {}

  load(): Observable<AppDatabase> {
    this.request ??= this.http.get<AppDatabase>('assets/db.json').pipe(
      shareReplay({ bufferSize: 1, refCount: false })
    );
    return this.request;
  }

  retry(): Observable<AppDatabase> {
    this.request = undefined;
    return this.load();
  }
}
