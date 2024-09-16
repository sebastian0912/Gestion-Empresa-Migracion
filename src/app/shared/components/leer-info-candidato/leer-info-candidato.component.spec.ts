import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeerInfoCandidatoComponent } from './leer-info-candidato.component';

describe('LeerInfoCandidatoComponent', () => {
  let component: LeerInfoCandidatoComponent;
  let fixture: ComponentFixture<LeerInfoCandidatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeerInfoCandidatoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeerInfoCandidatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
