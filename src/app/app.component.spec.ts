import {TestBed, ComponentFixture} from '@angular/core/testing';
import { AppComponent } from './app.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";

import {CountryService} from "./shared/services/country.service";
import {of, throwError} from "rxjs";
import {COUNTRY_INFO_SET} from "./shared/constants/shared.constants.spec";

describe('AppComponent', () => {
  let component: AppComponent;
  let countryService: CountryService;
  let fixture: ComponentFixture<AppComponent>;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AppComponent],
      providers: [CountryService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    countryService = TestBed.get(CountryService);

    ((component as any).getCountryInfoSubscription) = { unsubscribe: jasmine.createSpy() };
  });

  describe('component', () => {
    it('should create', () => expect(component).toBeTruthy());

    it('should define the right member properties', () => {
      [
        'title',
        'loading',
        'error',
        'countryInfoSet',
      ].forEach(prop => expect(component.hasOwnProperty(prop)).toBeDefined());
    });

    it('should have correct values for its properties', () => {
      expect(component.title).toEqual('get-countried');
      expect(component.loading).not.toBeDefined();
      expect(component.error).not.toBeDefined();
      expect(component.countryInfoSet).not.toBeDefined();
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
        getCountryInfoSpy.and.returnValue(throwError({ errorCode: 3344 }));
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
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Get Countried!');
  });
});
