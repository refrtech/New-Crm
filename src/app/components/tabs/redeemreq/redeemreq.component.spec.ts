import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeemreqComponent } from './redeemreq.component';

describe('RedeemreqComponent', () => {
  let component: RedeemreqComponent;
  let fixture: ComponentFixture<RedeemreqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedeemreqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeemreqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
