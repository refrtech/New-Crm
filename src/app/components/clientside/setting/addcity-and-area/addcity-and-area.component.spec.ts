import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcityAndAreaComponent } from './addcity-and-area.component';

describe('AddcityAndAreaComponent', () => {
  let component: AddcityAndAreaComponent;
  let fixture: ComponentFixture<AddcityAndAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddcityAndAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcityAndAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
