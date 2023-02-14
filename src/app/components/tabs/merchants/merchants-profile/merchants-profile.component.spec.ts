import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantsProfileComponent } from './merchants-profile.component';

describe('MerchantsProfileComponent', () => {
  let component: MerchantsProfileComponent;
  let fixture: ComponentFixture<MerchantsProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantsProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
