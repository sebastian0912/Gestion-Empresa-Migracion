import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasTurneroComponent } from './estadisticas-turnero.component';

describe('EstadisticasTurneroComponent', () => {
  let component: EstadisticasTurneroComponent;
  let fixture: ComponentFixture<EstadisticasTurneroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadisticasTurneroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticasTurneroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
