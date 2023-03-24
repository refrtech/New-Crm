import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesinternalComponent } from './categoriesinternal.component';

describe('CategoriesinternalComponent', () => {
  let component: CategoriesinternalComponent;
  let fixture: ComponentFixture<CategoriesinternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriesinternalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesinternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
