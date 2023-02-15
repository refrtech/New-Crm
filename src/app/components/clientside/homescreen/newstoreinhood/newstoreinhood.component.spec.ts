import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewstoreinhoodComponent } from './newstoreinhood.component';

describe('NewstoreinhoodComponent', () => {
  let component: NewstoreinhoodComponent;
  let fixture: ComponentFixture<NewstoreinhoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewstoreinhoodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewstoreinhoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
