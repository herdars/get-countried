import {Component, OnDestroy, OnInit} from '@angular/core';

import {finalize} from 'rxjs/operators';
import {Subscription} from "rxjs";

import {CountryService} from "./shared/services/country.service";
import {CountryInfo} from "./shared/interfaces/shared.interfaces";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'get-countried';
  loading: boolean;
  error: boolean;
  countryInfoSet: Array<CountryInfo>;

  private getCountryInfoSubscription: Subscription = null;

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.error = false;
    this.loading = true;
    this.countryInfoSet = [];

    this.getCountryInfoSubscription = this.countryService
      .getCountryInfo()
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        (countryInfoSet: Array<CountryInfo>) => this.countryInfoSet = countryInfoSet,
        (error: any) => this.error = true
      )
  }

  ngOnDestroy(): void {
    this.getCountryInfoSubscription.unsubscribe();
  }

  updateSelectedCountry(country: CountryInfo) {
    debugger
  }
}
