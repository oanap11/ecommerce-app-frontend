import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Country } from '../common/country/country';
import { map } from 'rxjs/operators';
import { State } from '../common/state/state';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private countriesUrl = `${environment.apiUrl}/countries`;
  private statesUrl = `${environment.apiUrl}/states`;

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(countryCode: string): Observable<State[]> {
    const searchStatesUrl = `${this.statesUrl}/search/findStateByCountryCode?code=${countryCode}`;
    
    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );
  }

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

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}