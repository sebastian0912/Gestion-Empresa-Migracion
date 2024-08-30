import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioIncapacidadComponent } from './formulario-incapacidad.component';

describe('FormularioIncapacidadComponent', () => {
  let component: FormularioIncapacidadComponent;
  let fixture: ComponentFixture<FormularioIncapacidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioIncapacidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioIncapacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
