import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardFilterTable } from './standard-filter-table';

describe('StandardFilterTable', () => {
  let component: StandardFilterTable;
  let fixture: ComponentFixture<StandardFilterTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardFilterTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandardFilterTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
