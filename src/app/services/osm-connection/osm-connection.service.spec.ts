/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OsmConnectionService } from './osm-connection.service';

describe('Service: OsmConnection', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OsmConnectionService]
    });
  });

  it('should ...', inject([OsmConnectionService], (service: OsmConnectionService) => {
    expect(service).toBeTruthy();
  }));
});