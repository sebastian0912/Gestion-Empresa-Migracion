import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvioPaqueteDocumentacionComponent } from './envio-paquete-documentacion.component';

describe('EnvioPaqueteDocumentacionComponent', () => {
  let component: EnvioPaqueteDocumentacionComponent;
  let fixture: ComponentFixture<EnvioPaqueteDocumentacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvioPaqueteDocumentacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvioPaqueteDocumentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
