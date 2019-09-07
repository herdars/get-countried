import {TestBed, ComponentFixture} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";

import {CountryService} from "./shared/services/country.service";
import {of, throwError} from "rxjs";
import {COUNTRY_INFO_SET} from "./shared/constants/shared.constants.spec";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {By} from "@angular/platform-browser";

describe('AppComponent', () => {
  let component: AppComponent;
  let countryService: CountryService;
  let fixture: ComponentFixture<AppComponent>;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AppComponent],
      providers: [CountryService],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    countryService = TestBed.get(CountryService);

    ((component as any).getCountryInfoSubscription) = {unsubscribe: jasmine.createSpy()};
  });

  describe('component', () => {
    it('should create', () => expect(component).toBeTruthy());

    it('should define the right member properties', () => {
      [
        'title',
        'loading',
        'error',
        'countryInfoSet',
        'selectedCountry',
        'getCountryInfoSubscription'
      ].forEach(prop => expect(component.hasOwnProperty(prop)).toBeDefined());
    });

    it('should have correct values for its properties', () => {
      expect(component.loading).not.toBeDefined();
      expect(component.error).not.toBeDefined();
      expect(component.countryInfoSet).not.toBeDefined();
      expect(component.selectedCountry).not.toBeDefined();
    });

    describe('on init', () => {
      let getCountryInfoSpy: jasmine.Spy;

      beforeEach(() => getCountryInfoSpy = spyOn(countryService, 'getCountryInfo').and.returnValue(of([])));
      afterEach(() => getCountryInfoSpy.calls.reset());

      it('should make a call to the countryService\'s getCountryInfo method, assign the return value to countryInfoSet ' +
        'and reset loading state when it succeeds', () => {
        getCountryInfoSpy.and.returnValue(of(COUNTRY_INFO_SET));
        component.ngOnInit();

        expect(countryService.getCountryInfo).toHaveBeenCalled();
        expect(component.countryInfoSet).toEqual(COUNTRY_INFO_SET);
        expect(component.error).toBe(false);
        expect(component.loading).toBe(false);
      });

      it('should make a call to the countryService\'s getCountryInfo method, assign the error ' +
        'and reset loading state when it fails', () => {
        getCountryInfoSpy.and.returnValue(throwError({errorCode: 3344}));
        component.ngOnInit();

        expect(component.countryInfoSet).toEqual([]);
        expect(component.error).toBe(true);
        expect(component.loading).toBe(false);
      });
    });

    describe('on destroy', () => {
      it('should unsubscribe from the country info subscription', () => {
        component.ngOnDestroy();

        expect((component as any).getCountryInfoSubscription.unsubscribe).toHaveBeenCalled();
      });
    })

    describe('updateSelectedCountry', () => {
      it('should set the internal selectedCountry property to the incoming one', () => {
        component.selectedCountry = null;
        component.updateSelectedCountry(COUNTRY_INFO_SET[0]);

        expect(component.selectedCountry).toEqual(COUNTRY_INFO_SET[0]);
      });
    });
  });

  describe('view', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should show an awe inspiring header', () => expect(fixture.debugElement.query(By.css('h1')).nativeElement.innerHTML).toBe('Get Countried! - Your one stop shop for all your country information needs'))

    it('should show a loading message when loading, but not the error message or the actual components', () => {
      component.loading = true;
      fixture.detectChanges();

      const loading = fixture.debugElement.query(By.css('.js-test-loading'));
      expect(loading.nativeElement).toBeTruthy();
      expect(loading.nativeElement.innerHTML).toContain('Loading ...');

      expect(fixture.debugElement.query(By.css('.js-test-error'))).toBeFalsy();
      expect(fixture.debugElement.query(By.css('gtc-search-box'))).toBeFalsy();
      expect(fixture.debugElement.query(By.css('gtc-country-info'))).toBeFalsy();
      expect(fixture.debugElement.query(By.css('gtc-history-list'))).toBeFalsy();
    });

    describe('when not loading', () => {
      beforeEach(() => component.loading = false);

      it('should show an error when the component is in error state, but none of the real stuff', () => {
        component.error = true;
        fixture.detectChanges();

        const error = fixture.debugElement.query(By.css('.js-test-error'));
        expect(error.nativeElement).toBeTruthy();
        expect(error.nativeElement.innerHTML).toContain('Unable to load country country information. Come back later for some countriness.');

        expect(fixture.debugElement.query(By.css('gtc-search-box'))).toBeFalsy();
        expect(fixture.debugElement.query(By.css('gtc-country-info'))).toBeFalsy();
        expect(fixture.debugElement.query(By.css('gtc-history-list'))).toBeFalsy();
      });

      describe('when the component is not in error state', () => {
        beforeEach(() => {
          component.error = false;
          fixture.detectChanges();
        });

        it('should not show the error message', () => expect(fixture.debugElement.query(By.css('.js-test-error'))).toBeFalsy());

        it('shows the gt-search-box component with all the correct config and event handlers attached', () => {
          const searchBoxComponent = fixture.debugElement.query(By.css('gtc-search-box'));
          expect(searchBoxComponent.nativeElement).toBeTruthy();

          expect(searchBoxComponent.properties.countryInfoSet).toEqual(component.countryInfoSet);
          expect(searchBoxComponent.properties.countryIncoming).toEqual(component.selectedCountry);

          spyOn(component, 'updateSelectedCountry');
          searchBoxComponent.nativeElement.dispatchEvent(new Event('countrySelected'));

          expect(component.updateSelectedCountry).toHaveBeenCalled();
        });

        it('shows the gtc-country-info component with all the correct config', () => {
          const countryInfoComponent = fixture.debugElement.query(By.css('gtc-country-info'));
          expect(countryInfoComponent.nativeElement).toBeTruthy();
          expect(countryInfoComponent.properties.countryInfo).toEqual(component.selectedCountry);
        });

        it('shows the gtc-history-list component with all the correct config and event handlers attached', () => {
          const historyListComponent = fixture.debugElement.query(By.css('gtc-history-list'));
          expect(historyListComponent.nativeElement).toBeTruthy();

          expect(historyListComponent.properties.countryInfo).toEqual(component.selectedCountry);

          spyOn(component, 'updateSelectedCountry');
          historyListComponent.nativeElement.dispatchEvent(new Event('historicalCountrySelected'));

          expect(component.updateSelectedCountry).toHaveBeenCalled();
        });
      });
    });
  });
});
