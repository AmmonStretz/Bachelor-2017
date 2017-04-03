/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MapManagementService } from './map-management.service';

describe('Service: MapManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapManagementService]
    });
  });

  it('should ...', inject([MapManagementService], (service: MapManagementService) => {
    expect(service).toBeTruthy();
  }));
});