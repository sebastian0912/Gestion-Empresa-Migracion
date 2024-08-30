import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubidaArchivosIncapacidadesComponent } from './subida-archivos-incapacidades.component';

describe('SubidaArchivosIncapacidadesComponent', () => {
  let component: SubidaArchivosIncapacidadesComponent;
  let fixture: ComponentFixture<SubidaArchivosIncapacidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubidaArchivosIncapacidadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubidaArchivosIncapacidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
