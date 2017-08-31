import { TestBed, inject } from '@angular/core/testing';

import { ToggleService } from './toggle.service';

describe('ToggleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToggleService]
    });
  });

  it('should be created', inject([ToggleService], (service: ToggleService) => {
    expect(service).toBeTruthy();
  }));
});
