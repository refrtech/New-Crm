import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsdetailComponent } from './brandsdetail.component';

describe('BrandsdetailComponent', () => {
  let component: BrandsdetailComponent;
  let fixture: ComponentFixture<BrandsdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandsdetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandsdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
