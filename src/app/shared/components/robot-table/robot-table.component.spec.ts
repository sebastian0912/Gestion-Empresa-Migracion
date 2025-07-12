import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotTableComponent } from './robot-table.component';

describe('RobotTableComponent', () => {
  let component: RobotTableComponent;
  let fixture: ComponentFixture<RobotTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RobotTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RobotTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
