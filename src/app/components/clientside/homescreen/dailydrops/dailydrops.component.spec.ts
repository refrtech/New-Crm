import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailydropsComponent } from './dailydrops.component';

describe('DailydropsComponent', () => {
  let component: DailydropsComponent;
  let fixture: ComponentFixture<DailydropsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailydropsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailydropsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
