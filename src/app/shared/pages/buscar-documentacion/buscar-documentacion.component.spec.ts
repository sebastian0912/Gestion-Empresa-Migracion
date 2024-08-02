import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarDocumentacionComponent } from './buscar-documentacion.component';

describe('BuscarDocumentacionComponent', () => {
  let component: BuscarDocumentacionComponent;
  let fixture: ComponentFixture<BuscarDocumentacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarDocumentacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarDocumentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
