import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusTrackerComponent } from './status-tracker.component';

describe('StatusTrackerComponent', () => {
  let component: StatusTrackerComponent;
  let fixture: ComponentFixture<StatusTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
