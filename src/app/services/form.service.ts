import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    return of(this.generateNumberRange(startMonth, 12));
  }

  getCreditCardYears(): Observable<number[]> {
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;
    return of(this.generateNumberRange(startYear, endYear));
  }

  private generateNumberRange(start: number, end: number): number[] {
    let data: number[] = [];
    for (let number = start; number <= end; number++) {
      data.push(number);
    }
    return data;
  }

}
