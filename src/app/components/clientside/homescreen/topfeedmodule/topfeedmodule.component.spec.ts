import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopfeedmoduleComponent } from './topfeedmodule.component';

describe('TopfeedmoduleComponent', () => {
  let component: TopfeedmoduleComponent;
  let fixture: ComponentFixture<TopfeedmoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopfeedmoduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopfeedmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
