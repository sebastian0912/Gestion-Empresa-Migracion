import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarSuperiorComponent } from './navbar-superior.component';

describe('NavbarSuperiorComponent', () => {
  let component: NavbarSuperiorComponent;
  let fixture: ComponentFixture<NavbarSuperiorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarSuperiorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarSuperiorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
