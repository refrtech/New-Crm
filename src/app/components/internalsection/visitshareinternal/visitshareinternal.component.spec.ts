import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitshareinternalComponent } from './visitshareinternal.component';

describe('VisitshareinternalComponent', () => {
  let component: VisitshareinternalComponent;
  let fixture: ComponentFixture<VisitshareinternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitshareinternalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitshareinternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
