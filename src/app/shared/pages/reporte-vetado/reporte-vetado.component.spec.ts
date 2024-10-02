import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteVetadoComponent } from './reporte-vetado.component';

describe('ReporteVetadoComponent', () => {
  let component: ReporteVetadoComponent;
  let fixture: ComponentFixture<ReporteVetadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteVetadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteVetadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
