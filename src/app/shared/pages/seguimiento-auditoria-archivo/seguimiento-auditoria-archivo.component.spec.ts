import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoAuditoriaArchivoComponent } from './seguimiento-auditoria-archivo.component';

describe('SeguimientoAuditoriaArchivoComponent', () => {
  let component: SeguimientoAuditoriaArchivoComponent;
  let fixture: ComponentFixture<SeguimientoAuditoriaArchivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoAuditoriaArchivoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoAuditoriaArchivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
