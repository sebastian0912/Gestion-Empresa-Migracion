import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosContratacionComponent } from './documentos-contratacion.component';

describe('DocumentosContratacionComponent', () => {
  let component: DocumentosContratacionComponent;
  let fixture: ComponentFixture<DocumentosContratacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentosContratacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentosContratacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
