import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalsectionComponent } from './internalsection.component';

describe('InternalsectionComponent', () => {
  let component: InternalsectionComponent;
  let fixture: ComponentFixture<InternalsectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalsectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
