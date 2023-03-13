import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VSAnodescatComponent } from './vsanodescat.component';

describe('VSAnodescatComponent', () => {
  let component: VSAnodescatComponent;
  let fixture: ComponentFixture<VSAnodescatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VSAnodescatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VSAnodescatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
