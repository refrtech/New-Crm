import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HgbnodecatstoresComponent } from './hgbnodecatstores.component';

describe('HgbnodecatstoresComponent', () => {
  let component: HgbnodecatstoresComponent;
  let fixture: ComponentFixture<HgbnodecatstoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HgbnodecatstoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HgbnodecatstoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
