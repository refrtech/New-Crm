import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsneighbourhoodComponent } from './brandsneighbourhood.component';

describe('BrandsneighbourhoodComponent', () => {
  let component: BrandsneighbourhoodComponent;
  let fixture: ComponentFixture<BrandsneighbourhoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandsneighbourhoodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandsneighbourhoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
