import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfExamComponent } from './prof-exam.component';

describe('ProfExamComponent', () => {
  let component: ProfExamComponent;
  let fixture: ComponentFixture<ProfExamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfExamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
