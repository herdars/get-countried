interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface CountryInfo {
  name: string;
  isoCode: string;
  flag: string;
  currencies: Array<Currency>;
  coOrdinates: Array<number>;
  area: number;
}
