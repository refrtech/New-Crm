import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitsharedetailsComponent } from './visitsharedetails.component';

describe('VisitsharedetailsComponent', () => {
  let component: VisitsharedetailsComponent;
  let fixture: ComponentFixture<VisitsharedetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitsharedetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitsharedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
