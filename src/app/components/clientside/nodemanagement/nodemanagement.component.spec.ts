import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodemanagementComponent } from './nodemanagement.component';

describe('NodemanagementComponent', () => {
  let component: NodemanagementComponent;
  let fixture: ComponentFixture<NodemanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodemanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
