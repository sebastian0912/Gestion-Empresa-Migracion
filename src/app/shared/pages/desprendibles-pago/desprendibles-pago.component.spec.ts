import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesprendiblesPagoComponent } from './desprendibles-pago.component';

describe('DesprendiblesPagoComponent', () => {
  let component: DesprendiblesPagoComponent;
  let fixture: ComponentFixture<DesprendiblesPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesprendiblesPagoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesprendiblesPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
