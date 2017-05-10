/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MarkerInformationService } from './marker-information.service';

describe('Service: MarkerInformation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MarkerInformationService]
    });
  });

  it('should ...', inject([MarkerInformationService], (service: MarkerInformationService) => {
    expect(service).toBeTruthy();
  }));
});