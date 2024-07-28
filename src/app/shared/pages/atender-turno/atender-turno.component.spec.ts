import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtenderTurnoComponent } from './atender-turno.component';

describe('AtenderTurnoComponent', () => {
  let component: AtenderTurnoComponent;
  let fixture: ComponentFixture<AtenderTurnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtenderTurnoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtenderTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
