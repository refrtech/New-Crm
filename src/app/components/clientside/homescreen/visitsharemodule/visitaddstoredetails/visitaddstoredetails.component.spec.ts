import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitaddstoredetailsComponent } from './visitaddstoredetails.component';

describe('VisitaddstoredetailsComponent', () => {
  let component: VisitaddstoredetailsComponent;
  let fixture: ComponentFixture<VisitaddstoredetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitaddstoredetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitaddstoredetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
