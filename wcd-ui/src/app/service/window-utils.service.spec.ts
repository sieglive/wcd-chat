import { TestBed, inject } from '@angular/core/testing';

import { WindowUtilsService } from './window-utils.service';

describe('WindowUtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WindowUtilsService]
    });
  });

  it('should be created', inject([WindowUtilsService], (service: WindowUtilsService) => {
    expect(service).toBeTruthy();
  }));
});
