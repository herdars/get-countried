import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CountryInfo } from '@shared/interfaces/shared.interfaces';

@Component({
  selector: 'gtc-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent implements OnChanges {
  @Input() countryInfo: CountryInfo;
  @Output() historicalCountrySelected: EventEmitter<CountryInfo> = new EventEmitter<CountryInfo>();

  historyList: Array<CountryInfo> = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.countryInfo && changes.countryInfo.currentValue) {
      this.historyList = this.historyList.filter((country: CountryInfo) => country.isoCode !== changes.countryInfo.currentValue.isoCode);
      this.historyList.unshift(changes.countryInfo.currentValue);
    }
  }
}
