import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaFormularioComponent } from './consulta-formulario.component';

describe('ConsultaFormularioComponent', () => {
  let component: ConsultaFormularioComponent;
  let fixture: ComponentFixture<ConsultaFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaFormularioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
