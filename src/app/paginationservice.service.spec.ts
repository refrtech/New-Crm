import { TestBed } from '@angular/core/testing';

import { PaginationserviceService } from './paginationservice.service';

describe('PaginationserviceService', () => {
  let service: PaginationserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginationserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
