import {CountryInfo} from '../interfaces/shared.interfaces';

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
  },
  {
    name: 'United Kingdom of Great Britain and Northern Ireland',
    isoCode: 'GBR',
    flag: 'https://restcountries.eu/data/gbr.svg',
    currencies: [
      {
        code: 'GBP',
        name: 'British pound',
        symbol: '£'
      }
    ],
    coOrdinates: [54.0, -2.0],
    area: 242900.0,
  }
];
