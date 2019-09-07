import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CountryInfo } from '../interfaces/shared.interfaces';

const COUNTRY_API: string = 'https://restcountries.eu/rest/v2/all';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  constructor(private httpClient: HttpClient) {}

  getCountryInfo(): Observable<Array<CountryInfo>> {
    return this.httpClient.get<Array<any>>(COUNTRY_API).pipe(
      map((response: Array<any>) =>
        response.map((country: any) => ({
          name: country.name,
          isoCode: country.alpha3Code,
          flag: country.flag,
          currencies: country.currencies,
          coOrdinates: country.latlng,
          area: country.area
        }))
      )
    );
  }
}
