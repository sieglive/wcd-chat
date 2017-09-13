import { TestBed, async, inject } from '@angular/core/testing';

import { AddressGuard } from './address.guard';

describe('AddressGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddressGuard]
    });
  });

  it('should ...', inject([AddressGuard], (guard: AddressGuard) => {
    expect(guard).toBeTruthy();
  }));
});
