import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoAuditoriaComponent } from './seguimiento-auditoria.component';

describe('SeguimientoAuditoriaComponent', () => {
  let component: SeguimientoAuditoriaComponent;
  let fixture: ComponentFixture<SeguimientoAuditoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoAuditoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoAuditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
