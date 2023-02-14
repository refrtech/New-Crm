import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnodeComponent } from './addnode.component';

describe('AddnodeComponent', () => {
  let component: AddnodeComponent;
  let fixture: ComponentFixture<AddnodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddnodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
