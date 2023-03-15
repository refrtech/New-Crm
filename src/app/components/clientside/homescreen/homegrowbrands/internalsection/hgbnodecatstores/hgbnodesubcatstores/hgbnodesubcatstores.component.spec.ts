import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HgbnodesubcatstoresComponent } from './hgbnodesubcatstores.component';

describe('HgbnodesubcatstoresComponent', () => {
  let component: HgbnodesubcatstoresComponent;
  let fixture: ComponentFixture<HgbnodesubcatstoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HgbnodesubcatstoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HgbnodesubcatstoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
