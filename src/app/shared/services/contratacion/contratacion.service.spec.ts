import { TestBed } from '@angular/core/testing';

import { ContratacionService } from './contratacion.service';

describe('ContratacionService', () => {
  let service: ContratacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContratacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
