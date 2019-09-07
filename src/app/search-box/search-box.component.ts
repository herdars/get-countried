import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {filter} from 'lodash-es';

import {CountryInfo} from "@shared/interfaces/shared.interfaces";

@Component({
  selector: 'gtc-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit, OnChanges {
  @Input() countryInfoSet: Array<CountryInfo>;
  @Input() countryIncoming: CountryInfo;
  @Output() countrySelected: EventEmitter<CountryInfo> = new EventEmitter<CountryInfo>();

  inputForm: FormGroup;
  searchValueChangesSubscription: Subscription;
  filteredCountries: Array<CountryInfo>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.inputForm = this.fb.group({
      search: [''],
    });

    this.searchValueChangesSubscription = this.inputForm.controls['search'].valueChanges.subscribe(value => typeof(value) === 'string' && this.searchCountries(value));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.countryIncoming.currentValue && this.inputForm) {
      this.inputForm.controls['search'].setValue(changes.countryIncoming.currentValue);
    }
  }

  ngOnDestroy(): void {
    this.searchValueChangesSubscription.unsubscribe();
  }

  formatCountryName(country: CountryInfo): string {
    return country ? `${country.name} - ${country.isoCode}` : '';
  }

  transmitSelectedCountry(): void {
    this.countrySelected.emit(this.inputForm.controls['search'].value);
  }

  private searchCountries(value: string): void {
    const searchValue = value.toLowerCase().trim();
    this.filteredCountries = searchValue.length >= 3
      ? filter(this.countryInfoSet, (country: CountryInfo) => country.name.toLowerCase().indexOf(searchValue) > -1)
      : [];
    this.filteredCountries.length = this.filteredCountries.length > 10 ? 10 : this.filteredCountries.length;
  }
}
