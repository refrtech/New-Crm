import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsstoreComponent } from './brandsstore.component';

describe('BrandsstoreComponent', () => {
  let component: BrandsstoreComponent;
  let fixture: ComponentFixture<BrandsstoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandsstoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandsstoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
