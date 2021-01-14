import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestStudentComponent } from './test-student.component';

describe('TestStudentComponent', () => {
  let component: TestStudentComponent;
  let fixture: ComponentFixture<TestStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
