import { CountryInfo } from '../interfaces/shared.interfaces';

export const COUNTRY_INFO_SET: Array<CountryInfo> = [
  {
    name: 'Afghanistan',
    isoCode: 'AFG',
    flag: 'https://restcountries.eu/data/afg.svg',
    currencies: [
      {
        code: 'AFN',
        name: 'Afghan afghani',
        symbol: '؋'
      }
    ],
    coOrdinates: [33, 65],
    area: 652230
  },
  {
    name: 'Åland Islands',
    isoCode: 'ALA',
    flag: 'https://restcountries.eu/data/ala.svg',
    currencies: [
      {
        code: 'EUR',
        name: 'Euro',
        symbol: '€'
      }
    ],
    coOrdinates: [60.116667, 19.9],
    area: 1580
  }
];
