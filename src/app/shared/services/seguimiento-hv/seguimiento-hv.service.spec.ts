import { TestBed } from '@angular/core/testing';

import { SeguimientoHvService } from './seguimiento-hv.service';

describe('SeguimientoHvService', () => {
  let service: SeguimientoHvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeguimientoHvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
