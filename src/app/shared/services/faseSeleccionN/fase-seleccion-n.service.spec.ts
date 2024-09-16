import { TestBed } from '@angular/core/testing';

import { FaseSeleccionNService } from './fase-seleccion-n.service';

describe('FaseSeleccionNService', () => {
  let service: FaseSeleccionNService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaseSeleccionNService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
