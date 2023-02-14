import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomegrowbrandsComponent } from './homegrowbrands.component';

describe('HomegrowbrandsComponent', () => {
  let component: HomegrowbrandsComponent;
  let fixture: ComponentFixture<HomegrowbrandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomegrowbrandsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomegrowbrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
