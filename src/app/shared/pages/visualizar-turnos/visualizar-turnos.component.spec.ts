import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarTurnosComponent } from './visualizar-turnos.component';

describe('VisualizarTurnosComponent', () => {
  let component: VisualizarTurnosComponent;
  let fixture: ComponentFixture<VisualizarTurnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarTurnosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
