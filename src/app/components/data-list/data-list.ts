import { Component, Input } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-data-list',
  imports: [DatePipe, NgClass],
  templateUrl: './data-list.html',
  styleUrl: './data-list.css',
})
export class DataList {
  @Input() type!: 'contacts' | 'history'; //Recebe da Page Contacts ou History para diferenciar o tipo
  @Input() contact: any; // Recebe o Contacto de Contacts
  @Input() contactType: any; // Recebe o Tipo de Contacto
  @Input() call: any; // Recebe a Call de History

  colors = [
      'bg-red-500',
      'bg-yellow-500',
      'bg-lime-500',
      'bg-blue-500',
      'bg-purple-500',
      'bg-fuchsia-500',
      'bg-pink-500',
      'bg-rose-500',
    ];

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

  test(){
    console.log(this.call)
  }
}
