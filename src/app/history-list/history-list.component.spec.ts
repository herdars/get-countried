import { ComponentFixture, TestBed } from '@angular/core/testing';
import {Component, NO_ERRORS_SCHEMA} from "@angular/core";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ReactiveFormsModule} from "@angular/forms";
import {By} from "@angular/platform-browser";

import {CountryInfo} from "../shared/interfaces/shared.interfaces";
import {COUNTRY_INFO_SET} from "../shared/constants/shared.constants.spec";

import { HistoryListComponent } from './history-list.component';

@Component({
  template: `
      <gtc-history-list [countryInfo]="countryInfo"
                        (historicalCountrySelected)="updateSelectedCountry($event)">
      </gtc-history-list>
  `
})
class TestHostComponent {
  countryInfo: CountryInfo = COUNTRY_INFO_SET[0];

  updateSelectedCountry(evt) {
  }
}

describe('HistoryListComponent', () => {

  let component: HistoryListComponent;
  let fixture: ComponentFixture<HistoryListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryListComponent, TestHostComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryListComponent);
    component = fixture.componentInstance;
  });

  describe('component', () => {
    it('should create', () => expect(component).toBeTruthy());

    it('should define the right member properties', () => expect(component.hasOwnProperty('historyList')).toBeDefined());

    it('should have correct values for its properties', () => expect(component.historyList).toEqual([]));

    describe('on changes', () => {
      it('should filter out the new country from the history list and add it to the top of the list, if new relevant info comes in', () => {
        component.historyList = COUNTRY_INFO_SET;
        component.ngOnChanges({
          countryInfo: {
            currentValue: COUNTRY_INFO_SET[1]
          } as any
        });

        expect(component.historyList).toEqual([COUNTRY_INFO_SET[1], COUNTRY_INFO_SET[0]]);
      });

      it('should not affect the history list if the new info isn\'t relevant', () => {
        component.historyList = COUNTRY_INFO_SET;
        component.ngOnChanges({
          randomInfo: {
            currentValue: COUNTRY_INFO_SET[1]
          } as any
        });

        expect(component.historyList).toEqual(COUNTRY_INFO_SET);
      });
    });
  });

  describe('view', () => {
    it('should accept the input parameters and transmit the output parameters correctly', () => {
      const hostFixture: ComponentFixture<TestHostComponent> = TestBed.createComponent(TestHostComponent);
      const hostComponent: TestHostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();
      const historyListComponent = hostFixture.debugElement.query(By.css('gtc-history-list')).componentInstance;

      expect(historyListComponent.countryInfo).toEqual(hostComponent.countryInfo);

      spyOn(hostComponent, 'updateSelectedCountry');
      historyListComponent.historicalCountrySelected.emit(COUNTRY_INFO_SET[0]);
      expect(hostComponent.updateSelectedCountry).toHaveBeenCalledWith(COUNTRY_INFO_SET[0]);
    });

    it('should show nothing if there\'s no history list', () => {
      component.historyList = [];
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('h3'))).toBeFalsy();
      expect(fixture.debugElement.query(By.css('h4'))).toBeFalsy();
    });

    describe('when history list exists', () => {
      beforeEach(() => {
        component.historyList = COUNTRY_INFO_SET;
        fixture.detectChanges();
      });

      it('should show a slightly more inspired set of headers', () => {
        expect(fixture.debugElement.query(By.css('h3')).nativeElement.innerHTML).toBe('Here\'s a little history on the countries you\'ve been schooled on.')
        expect(fixture.debugElement.query(By.css('h4')).nativeElement.innerHTML).toBe('Click on the name for repeat schooling!')
      });

      it('should show a set of buttons for each country in the history list', () => {
        const buttons = fixture.debugElement.queryAll(By.css('button'));

        expect(buttons.length).toBe(2);

        expect(buttons[0].nativeElement.innerHTML).toBe('Afghanistan - AFG');
        expect(buttons[1].nativeElement.innerHTML).toBe('Åland Islands - ALA');
      });

      it('the buttons, when clicked should emit the historicalCountrySelected event with the country information', () => {
        const buttons = fixture.debugElement.queryAll(By.css('button'));
        spyOn(component.historicalCountrySelected, 'emit');

        buttons[0].nativeElement.dispatchEvent(new Event('click'));
        expect(component.historicalCountrySelected.emit).toHaveBeenCalledWith(COUNTRY_INFO_SET[0]);

        buttons[1].nativeElement.dispatchEvent(new Event('click'));
        expect(component.historicalCountrySelected.emit).toHaveBeenCalledWith(COUNTRY_INFO_SET[1]);
      })
    })
  });
});
