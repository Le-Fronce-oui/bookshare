import { TestBed } from '@angular/core/testing';

import { OrganisationsApiService } from './organisations-api.service';

describe('OrganisationsApiService', () => {
  let service: OrganisationsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganisationsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
