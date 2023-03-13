import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VSAnodecatstoresComponent } from './vsanodecatstores.component';

describe('VSAnodecatstoresComponent', () => {
  let component: VSAnodecatstoresComponent;
  let fixture: ComponentFixture<VSAnodecatstoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VSAnodecatstoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VSAnodecatstoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
