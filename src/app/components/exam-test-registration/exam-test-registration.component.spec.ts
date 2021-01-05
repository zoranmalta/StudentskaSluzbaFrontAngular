import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamTestRegistrationComponent } from './exam-test-registration.component';

describe('ExamTestRegistrationComponent', () => {
  let component: ExamTestRegistrationComponent;
  let fixture: ComponentFixture<ExamTestRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamTestRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamTestRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
