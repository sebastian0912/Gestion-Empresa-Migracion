import { TestBed } from '@angular/core/testing';

import { FaseContratacionNService } from './fase-contratacion-n.service';

describe('FaseContratacionNService', () => {
  let service: FaseContratacionNService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaseContratacionNService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
