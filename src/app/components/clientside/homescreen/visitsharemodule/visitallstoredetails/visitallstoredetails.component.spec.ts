import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitallstoredetailsComponent } from './visitallstoredetails.component';

describe('VisitallstoredetailsComponent', () => {
  let component: VisitallstoredetailsComponent;
  let fixture: ComponentFixture<VisitallstoredetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitallstoredetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitallstoredetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
