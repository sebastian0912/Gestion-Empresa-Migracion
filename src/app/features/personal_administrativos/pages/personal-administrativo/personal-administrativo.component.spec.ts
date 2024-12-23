import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAdministrativoComponent } from './personal-administrativo.component';

describe('PersonalAdministrativoComponent', () => {
  let component: PersonalAdministrativoComponent;
  let fixture: ComponentFixture<PersonalAdministrativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalAdministrativoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalAdministrativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
