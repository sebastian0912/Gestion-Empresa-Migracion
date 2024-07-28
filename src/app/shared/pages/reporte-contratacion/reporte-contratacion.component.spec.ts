import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteContratacionComponent } from './reporte-contratacion.component';

describe('ReporteContratacionComponent', () => {
  let component: ReporteContratacionComponent;
  let fixture: ComponentFixture<ReporteContratacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteContratacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteContratacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
