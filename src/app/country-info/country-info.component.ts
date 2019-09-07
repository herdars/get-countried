import { Component, Input } from '@angular/core';
import { CountryInfo } from '@shared/interfaces/shared.interfaces';

@Component({
  selector: 'gtc-country-info',
  templateUrl: './country-info.component.html',
  styleUrls: ['./country-info.component.scss']
})
export class CountryInfoComponent {
  @Input() countryInfo: CountryInfo;
}
