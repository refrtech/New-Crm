import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HgbcreatecategoryComponent } from './hgbcreatecategory.component';

describe('HgbcreatecategoryComponent', () => {
  let component: HgbcreatecategoryComponent;
  let fixture: ComponentFixture<HgbcreatecategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HgbcreatecategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HgbcreatecategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
