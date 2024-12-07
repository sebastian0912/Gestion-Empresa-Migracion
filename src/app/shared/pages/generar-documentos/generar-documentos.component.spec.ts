import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarDocumentosComponent } from './generar-documentos.component';

describe('GenerarDocumentosComponent', () => {
  let component: GenerarDocumentosComponent;
  let fixture: ComponentFixture<GenerarDocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerarDocumentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerarDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
