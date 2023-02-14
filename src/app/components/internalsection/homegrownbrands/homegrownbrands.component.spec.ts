import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomegrownbrandsComponent } from './homegrownbrands.component';

describe('HomegrownbrandsComponent', () => {
  let component: HomegrownbrandsComponent;
  let fixture: ComponentFixture<HomegrownbrandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomegrownbrandsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomegrownbrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
