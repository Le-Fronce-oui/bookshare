import { TestBed } from '@angular/core/testing';

import { LoansApiService } from './loans-api.service';

describe('LoansApiService', () => {
  let service: LoansApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoansApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
