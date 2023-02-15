import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewstoredetailsComponent } from './newstoredetails.component';

describe('NewstoredetailsComponent', () => {
  let component: NewstoredetailsComponent;
  let fixture: ComponentFixture<NewstoredetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewstoredetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewstoredetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
