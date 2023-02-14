import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationslideComponent } from './informationslide.component';

describe('InformationslideComponent', () => {
  let component: InformationslideComponent;
  let fixture: ComponentFixture<InformationslideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformationslideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationslideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
