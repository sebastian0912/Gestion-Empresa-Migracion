import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarIncapacidadComponent } from './buscar-incapacidad.component';

describe('BuscarIncapacidadComponent', () => {
  let component: BuscarIncapacidadComponent;
  let fixture: ComponentFixture<BuscarIncapacidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarIncapacidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarIncapacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
