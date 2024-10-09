import { TestBed } from '@angular/core/testing';

import { SeguimientoHvArchivoService } from './seguimiento-hv-archivo.service';

describe('SeguimientoHvArchivoService', () => {
  let service: SeguimientoHvArchivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeguimientoHvArchivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
