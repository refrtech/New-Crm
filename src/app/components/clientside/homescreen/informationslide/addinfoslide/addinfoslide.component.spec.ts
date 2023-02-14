import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddinfoslideComponent } from './addinfoslide.component';

describe('AddinfoslideComponent', () => {
  let component: AddinfoslideComponent;
  let fixture: ComponentFixture<AddinfoslideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddinfoslideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddinfoslideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
