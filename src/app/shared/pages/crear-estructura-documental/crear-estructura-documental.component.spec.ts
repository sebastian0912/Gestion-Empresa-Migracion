import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEstructuraDocumentalComponent } from './crear-estructura-documental.component';

describe('CrearEstructuraDocumentalComponent', () => {
  let component: CrearEstructuraDocumentalComponent;
  let fixture: ComponentFixture<CrearEstructuraDocumentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearEstructuraDocumentalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearEstructuraDocumentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
