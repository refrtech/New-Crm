import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodemanagementCitysComponent } from './nodemanagement-citys.component';

describe('NodemanagementCitysComponent', () => {
  let component: NodemanagementCitysComponent;
  let fixture: ComponentFixture<NodemanagementCitysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodemanagementCitysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodemanagementCitysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
