import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecibirPaqueteDocumentacionComponent } from './recibir-paquete-documentacion.component';

describe('RecibirPaqueteDocumentacionComponent', () => {
  let component: RecibirPaqueteDocumentacionComponent;
  let fixture: ComponentFixture<RecibirPaqueteDocumentacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecibirPaqueteDocumentacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecibirPaqueteDocumentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
