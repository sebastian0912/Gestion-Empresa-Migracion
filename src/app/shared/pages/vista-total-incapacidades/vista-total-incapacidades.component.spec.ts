import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaTotalIncapacidadesComponent } from './vista-total-incapacidades.component';

describe('VistaTotalIncapacidadesComponent', () => {
  let component: VistaTotalIncapacidadesComponent;
  let fixture: ComponentFixture<VistaTotalIncapacidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaTotalIncapacidadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaTotalIncapacidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
