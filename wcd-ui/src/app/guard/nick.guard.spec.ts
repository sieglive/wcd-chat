import { TestBed, async, inject } from '@angular/core/testing';

import { NickGuard } from './nick.guard';

describe('NickGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NickGuard]
    });
  });

  it('should ...', inject([NickGuard], (guard: NickGuard) => {
    expect(guard).toBeTruthy();
  }));
});
