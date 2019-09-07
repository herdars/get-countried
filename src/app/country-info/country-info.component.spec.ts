import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, NO_ERRORS_SCHEMA} from "@angular/core";
import {By} from "@angular/platform-browser";

import {COUNTRY_INFO_SET} from "@shared/constants/shared.constants.spec";
import {CountryInfo} from "@shared/interfaces/shared.interfaces";

import {CountryInfoComponent} from "./country-info.component";

@Component({
  template: `
      <gtc-country-info [countryInfo]="countryInfo"></gtc-country-info>
  `
})
class TestHostComponent {
  countryInfo: CountryInfo = COUNTRY_INFO_SET[0];
}

describe('CountryInfoComponent', () => {
  let component: CountryInfoComponent;
  let fixture: ComponentFixture<CountryInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountryInfoComponent, TestHostComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => expect(component).toBeTruthy());

  describe('view', () => {
    it('should accept the input parameters correctly', () => {
      const hostFixture: ComponentFixture<TestHostComponent> = TestBed.createComponent(TestHostComponent);
      const hostComponent: TestHostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();
      const countryInfoComponent = hostFixture.debugElement.query(By.css('gtc-country-info')).componentInstance;

      expect(countryInfoComponent.countryInfo).toEqual(hostComponent.countryInfo);
    });

    it('should show nothing if there\'s no country info', () => {
      component.countryInfo = null;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('h3'))).toBeFalsy();
      expect(fixture.debugElement.query(By.css('dl'))).toBeFalsy();
    });

    describe('when country info exists', () => {
      beforeEach(() => {
        component.countryInfo = COUNTRY_INFO_SET[0];
        fixture.detectChanges();
      });

      it('should show an uninspired header', () => expect(fixture.debugElement.query(By.css('h3')).nativeElement.innerHTML).toBe('Some details about the country you selected:'))

      it('should show the country info in pieces', () => {
        const dts = fixture.debugElement.queryAll(By.css('dt'));
        const dds = fixture.debugElement.queryAll(By.css('dd'));

        expect(dts[0].nativeElement.innerHTML).toBe('');
        expect(dds[0].nativeElement.innerHTML).toContain('<img');
        expect(dds[0].nativeElement.innerHTML).toContain(`src="${COUNTRY_INFO_SET[0].flag}"`);

        expect(dts[1].nativeElement.innerHTML).toBe('Name:');
        expect(dds[1].nativeElement.innerHTML).toContain(COUNTRY_INFO_SET[0].name);

        expect(dts[2].nativeElement.innerHTML).toBe('Primary currency used:');
        expect(dds[2].nativeElement.innerHTML).toContain(COUNTRY_INFO_SET[0].currencies[0].name);

        expect(dts[3].nativeElement.innerHTML).toBe('Latitude / Longitude:');
        expect(dds[3].nativeElement.innerHTML).toContain(`${COUNTRY_INFO_SET[0].coOrdinates[0]} / ${COUNTRY_INFO_SET[0].coOrdinates[1]}`);

        expect(dts[4].nativeElement.innerHTML).toBe('Land area:');
        expect(dds[4].nativeElement.innerHTML).toContain(COUNTRY_INFO_SET[0].area);
      });
    })
  });
});
