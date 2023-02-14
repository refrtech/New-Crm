import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteditstoredetailsComponent } from './visiteditstoredetails.component';

describe('VisiteditstoredetailsComponent', () => {
  let component: VisiteditstoredetailsComponent;
  let fixture: ComponentFixture<VisiteditstoredetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisiteditstoredetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteditstoredetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
