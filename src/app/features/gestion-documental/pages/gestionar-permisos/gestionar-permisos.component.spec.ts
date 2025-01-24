import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarPermisosComponent } from './gestionar-permisos.component';

describe('GestionarPermisosComponent', () => {
  let component: GestionarPermisosComponent;
  let fixture: ComponentFixture<GestionarPermisosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarPermisosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarPermisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
