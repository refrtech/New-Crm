import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteformComponent } from './websiteform.component';

describe('WebsiteformComponent', () => {
  let component: WebsiteformComponent;
  let fixture: ComponentFixture<WebsiteformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebsiteformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
