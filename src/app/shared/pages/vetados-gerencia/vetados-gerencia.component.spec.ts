import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VetadosGerenciaComponent } from './vetados-gerencia.component';

describe('VetadosGerenciaComponent', () => {
  let component: VetadosGerenciaComponent;
  let fixture: ComponentFixture<VetadosGerenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VetadosGerenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VetadosGerenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
