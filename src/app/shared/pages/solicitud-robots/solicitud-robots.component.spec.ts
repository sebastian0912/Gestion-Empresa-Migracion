import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudRobotsComponent } from './solicitud-robots.component';

describe('SolicitudRobotsComponent', () => {
  let component: SolicitudRobotsComponent;
  let fixture: ComponentFixture<SolicitudRobotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudRobotsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudRobotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
