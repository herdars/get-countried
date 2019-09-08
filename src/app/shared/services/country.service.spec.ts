import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { noop, of, throwError } from 'rxjs';

import { COUNTRY_INFO_SET } from '../constants/shared.constants.spec';

import { CountryService } from './country.service';
import { RAW_COUNTRY_INFO } from './country.constants.spec';

const COUNTRY_API: string = 'https://restcountries.eu/rest/v2/all';

describe('CountryService', () => {
  const successHandler: jasmine.Spy = jasmine.createSpy();
  const errorHandler: jasmine.Spy = jasmine.createSpy();

  let service: CountryService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.get(CountryService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    successHandler.calls.reset();
    errorHandler.calls.reset();
  });

  it('should be created', () => expect(service).toBeTruthy());

  describe('getCountryInfo', () => {
    it('should make a call to the correct API', () => {
      service.getCountryInfo().subscribe(noop, noop);

      const request = httpTestingController.expectOne(COUNTRY_API);
      expect(request.request.method).toBe('GET');
    });

    it("should format the response to the presentation model's requirement and return stream the country info to the observable when the call succeeds", () => {
      spyOn((service as any).httpClient, 'get').and.returnValue(of(RAW_COUNTRY_INFO));
      service.getCountryInfo().subscribe(successHandler, errorHandler);

      expect(successHandler).toHaveBeenCalledWith(COUNTRY_INFO_SET);
      expect(errorHandler).not.toHaveBeenCalled();
    });

    it('should reject the observable in case of an error', () => {
      spyOn((service as any).httpClient, 'get').and.returnValue(throwError({ errorCode: 500 }));
      service.getCountryInfo().subscribe(successHandler, errorHandler);

      expect(successHandler).not.toHaveBeenCalled();
      expect(errorHandler).toHaveBeenCalled();
    });
  });
});
