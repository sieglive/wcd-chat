import { TestBed, async, inject } from '@angular/core/testing';

import { ChatGuard } from './chat.guard';

describe('ChatGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatGuard]
    });
  });

  it('should ...', inject([ChatGuard], (guard: ChatGuard) => {
    expect(guard).toBeTruthy();
  }));
});
