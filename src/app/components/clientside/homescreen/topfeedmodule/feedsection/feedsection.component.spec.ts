import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedsectionComponent } from './feedsection.component';

describe('FeedsectionComponent', () => {
  let component: FeedsectionComponent;
  let fixture: ComponentFixture<FeedsectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedsectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
