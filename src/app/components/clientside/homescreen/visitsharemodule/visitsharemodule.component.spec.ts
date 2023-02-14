import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitsharemoduleComponent } from './visitsharemodule.component';

describe('VisitsharemoduleComponent', () => {
  let component: VisitsharemoduleComponent;
  let fixture: ComponentFixture<VisitsharemoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitsharemoduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitsharemoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
