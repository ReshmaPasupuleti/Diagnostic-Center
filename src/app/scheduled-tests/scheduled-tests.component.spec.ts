import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledTestsComponent } from './scheduled-tests.component';

describe('ScheduledTestsComponent', () => {
  let component: ScheduledTestsComponent;
  let fixture: ComponentFixture<ScheduledTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduledTestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
