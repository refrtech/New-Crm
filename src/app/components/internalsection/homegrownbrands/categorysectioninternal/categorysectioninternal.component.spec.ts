import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorysectioninternalComponent } from './categorysectioninternal.component';

describe('CategorysectioninternalComponent', () => {
  let component: CategorysectioninternalComponent;
  let fixture: ComponentFixture<CategorysectioninternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategorysectioninternalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorysectioninternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
