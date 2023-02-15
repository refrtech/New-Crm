import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaildropsbrandsComponent } from './daildropsbrands.component';

describe('DaildropsbrandsComponent', () => {
  let component: DaildropsbrandsComponent;
  let fixture: ComponentFixture<DaildropsbrandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaildropsbrandsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaildropsbrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
