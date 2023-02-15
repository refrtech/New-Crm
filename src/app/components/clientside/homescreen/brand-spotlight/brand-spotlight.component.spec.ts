import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandSpotlightComponent } from './brand-spotlight.component';

describe('BrandSpotlightComponent', () => {
  let component: BrandSpotlightComponent;
  let fixture: ComponentFixture<BrandSpotlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandSpotlightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandSpotlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
