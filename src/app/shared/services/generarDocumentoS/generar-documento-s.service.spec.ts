import { TestBed } from '@angular/core/testing';

import { GenerarDocumentoSService } from './generar-documento-s.service';

describe('GenerarDocumentoSService', () => {
  let service: GenerarDocumentoSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerarDocumentoSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
