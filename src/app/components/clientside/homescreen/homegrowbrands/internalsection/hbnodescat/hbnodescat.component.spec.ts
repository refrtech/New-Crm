import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HbnodescatComponent } from './hbnodescat.component';

describe('HbnodescatComponent', () => {
  let component: HbnodescatComponent;
  let fixture: ComponentFixture<HbnodescatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HbnodescatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HbnodescatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
