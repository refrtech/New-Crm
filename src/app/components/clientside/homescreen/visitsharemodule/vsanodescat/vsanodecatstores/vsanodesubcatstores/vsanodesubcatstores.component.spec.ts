import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VSAnodesubcatstoresComponent } from './vsanodesubcatstores.component';

describe('VSAnodesubcatstoresComponent', () => {
  let component: VSAnodesubcatstoresComponent;
  let fixture: ComponentFixture<VSAnodesubcatstoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VSAnodesubcatstoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VSAnodesubcatstoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
