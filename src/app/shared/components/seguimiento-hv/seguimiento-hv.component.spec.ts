import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoHvComponent } from './seguimiento-hv.component';

describe('SeguimientoHvComponent', () => {
  let component: SeguimientoHvComponent;
  let fixture: ComponentFixture<SeguimientoHvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoHvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoHvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
