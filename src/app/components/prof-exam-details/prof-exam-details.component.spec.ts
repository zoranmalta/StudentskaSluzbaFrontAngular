import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfExamDetailsComponent } from './prof-exam-details.component';

describe('ProfExamDetailsComponent', () => {
  let component: ProfExamDetailsComponent;
  let fixture: ComponentFixture<ProfExamDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfExamDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfExamDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
