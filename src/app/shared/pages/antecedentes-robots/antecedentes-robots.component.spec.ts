import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntecedentesRobotsComponent } from './antecedentes-robots.component';

describe('AntecedentesRobotsComponent', () => {
  let component: AntecedentesRobotsComponent;
  let fixture: ComponentFixture<AntecedentesRobotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AntecedentesRobotsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AntecedentesRobotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
