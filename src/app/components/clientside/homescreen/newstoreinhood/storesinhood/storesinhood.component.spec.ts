import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoresinhoodComponent } from './storesinhood.component';

describe('StoresinhoodComponent', () => {
  let component: StoresinhoodComponent;
  let fixture: ComponentFixture<StoresinhoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoresinhoodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoresinhoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
