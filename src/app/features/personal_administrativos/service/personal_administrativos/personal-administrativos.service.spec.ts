import { TestBed } from '@angular/core/testing';

import { PersonalAdministrativosService } from './personal-administrativos.service';

describe('PersonalAdministrativosService', () => {
  let service: PersonalAdministrativosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalAdministrativosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
