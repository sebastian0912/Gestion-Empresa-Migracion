import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasAuditoriaComponent } from './estadisticas-auditoria.component';

describe('EstadisticasAuditoriaComponent', () => {
  let component: EstadisticasAuditoriaComponent;
  let fixture: ComponentFixture<EstadisticasAuditoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadisticasAuditoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticasAuditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
