import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, NO_ERRORS_SCHEMA} from "@angular/core";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatAutocompleteModule, MatInputModule} from "@angular/material";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {ReactiveFormsModule} from "@angular/forms";

import {By} from "@angular/platform-browser";

import {COUNTRY_INFO_SET} from "../shared/constants/shared.constants.spec";
import {SearchBoxComponent} from './search-box.component';
import {CountryInfo} from "../shared/interfaces/shared.interfaces";

@Component({
  template: `
      <gtc-search-box [countryInfoSet]="countryInfoSet"
                      [countryIncoming]="selectedCountry"
                      (countrySelected)="updateSelectedCountry($event)">
      </gtc-search-box>
  `
})
class TestHostComponent {
  countryInfoSet: Array<CountryInfo> = COUNTRY_INFO_SET;
  selectedCountry: CountryInfo = COUNTRY_INFO_SET[1];

  updateSelectedCountry(evt) {
  }
}

describe('SearchBoxComponent', () => {
  let component: SearchBoxComponent;
  let fixture: ComponentFixture<SearchBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchBoxComponent, TestHostComponent],
      imports: [
        HttpClientTestingModule,
        MatAutocompleteModule,
        MatInputModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBoxComponent);
    component = fixture.componentInstance;

    (component.searchValueChangesSubscription as any) = {unsubscribe: jasmine.createSpy()};
  });

  it('should create', () => expect(component).toBeTruthy());

  describe('component', () => {
    it('should create', () => expect(component).toBeTruthy());

    it('should define the right member properties', () => {
      [
        'inputForm',
        'searchValueChangesSubscription',
        'filteredCountries',
      ].forEach(prop => expect(component.hasOwnProperty(prop)).toBeDefined());
    });

    it('should have correct values for its properties', () => {
      expect(component.inputForm).not.toBeDefined();
      expect(component.filteredCountries).not.toBeDefined();
    });

    it('should accept the input properties correctly from the host component', () => {
      const hostFixture: ComponentFixture<TestHostComponent> = TestBed.createComponent(TestHostComponent);
      const hostComponent: TestHostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();
      const searchBoxComponent = hostFixture.debugElement.query(By.css('gtc-search-box')).componentInstance;

      expect(searchBoxComponent.countryInfoSet).toEqual(hostComponent.countryInfoSet);
    });

    describe('on init', () => {
      beforeEach(() => component.ngOnInit());

      it('should create the input form which should have the search field with the correct init value', () => {
        const searchControl = component.inputForm.controls['search'];

        expect(searchControl).toBeTruthy();
        expect(searchControl.value).toBe('');
      });

      it('should subscribe to value changes of the search field call to search countries if string type', () => {
        spyOn(component as any, 'searchCountries');

        expect((component as any).searchCountries).not.toHaveBeenCalled();

        component.inputForm.get('search').setValue({});
        expect((component as any).searchCountries).not.toHaveBeenCalled();

        component.inputForm.get('search').setValue('abc');
        expect((component as any).searchCountries).toHaveBeenCalledWith('abc');
      });
    });

    describe('on destroy', () => {
      it('should unsubscribe from the value changes subscription', () => {
        component.ngOnDestroy();
        expect(component.searchValueChangesSubscription.unsubscribe).toHaveBeenCalled();
      });
    });

    describe('on changes', () => {
      it('should update the form control value to the incoming value if the form exists', () => {
        component.ngOnInit();
        component.ngOnChanges({
          countryIncoming: {
            currentValue: COUNTRY_INFO_SET[0]
          } as any
        });

        expect(component.inputForm.controls['search'].value).toEqual(COUNTRY_INFO_SET[0]);
      });

      it('should not modify the form if one doesn\'t exist', () => {
        component.inputForm = null;
        component.ngOnChanges({
          countryIncoming: {
            currentValue: COUNTRY_INFO_SET[0]
          } as any
        });

        expect(component.inputForm).toBeNull();
      });
    });

    describe('formatCountryName', () => {
      it('should return back the formatted country name for display', () => expect(component.formatCountryName(COUNTRY_INFO_SET[0])).toBe('Afghanistan - AFG'));
    });

    describe('transmitSelectedCountry', () => {
      it('should emit the countrySelected with the value in the search field of the form', () => {
        component.ngOnInit();
        spyOn(component.countrySelected, 'emit');
        component.inputForm.controls['search'].setValue(COUNTRY_INFO_SET[0]);
        component.transmitSelectedCountry();

        expect(component.countrySelected.emit).toHaveBeenCalledWith(COUNTRY_INFO_SET[0]);
      });
    });

    describe('searchCountries', () => {
      it('should populate filteredCountries with a set of filtered country results from the country info set if the search string is 3 chars or longer, limited to 10', () => {
        component.countryInfoSet = [COUNTRY_INFO_SET[0], COUNTRY_INFO_SET[0], COUNTRY_INFO_SET[0], COUNTRY_INFO_SET[0], COUNTRY_INFO_SET[0], COUNTRY_INFO_SET[0], COUNTRY_INFO_SET[0], COUNTRY_INFO_SET[0], COUNTRY_INFO_SET[0], COUNTRY_INFO_SET[0], COUNTRY_INFO_SET[0]];
        (component as any).searchCountries('afg');

        expect(component.filteredCountries.length).toBe(10);
      });

      it('should populate filteredCountries with an empty array if the search string is less than 3 chars', () => {
        component.countryInfoSet = COUNTRY_INFO_SET;
        (component as any).searchCountries('af');

        expect(component.filteredCountries).toEqual([]);
      });
    });
  });

  describe('view', () => {
    it('should accept the input parameters and transmit the output parameters correctly', () => {
      const hostFixture: ComponentFixture<TestHostComponent> = TestBed.createComponent(TestHostComponent);
      const hostComponent: TestHostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();
      const searchBoxComponent = hostFixture.debugElement.query(By.css('gtc-search-box')).componentInstance;

      expect(searchBoxComponent.countryInfoSet).toEqual(hostComponent.countryInfoSet);
      expect(searchBoxComponent.countryIncoming).toEqual(hostComponent.selectedCountry);

      spyOn(hostComponent, 'updateSelectedCountry');
      searchBoxComponent.countrySelected.emit(COUNTRY_INFO_SET[0]);
      expect(hostComponent.updateSelectedCountry).toHaveBeenCalledWith(COUNTRY_INFO_SET[0]);
    });

    it('should contain the right form and the control within mapped onto the correct properties', () => {
      fixture.detectChanges();
      const form = fixture.debugElement.query(By.css('form'));
      expect(form).toBeTruthy();

      const input = form.query(By.css('input'));
      expect(input.nativeElement.getAttribute('formcontrolname')).toBe('search');
      expect(input.nativeElement.getAttribute('placeholder')).toBe('Enter a few characters');

      const autocomplete = form.query(By.css('mat-autocomplete'));
      expect(autocomplete).toBeTruthy();
    });
  });
});
