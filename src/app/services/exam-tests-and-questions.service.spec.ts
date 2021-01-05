import { TestBed } from '@angular/core/testing';

import { ExamTestsAndQuestionsService } from './exam-tests-and-questions.service';

describe('ExamTestsAndQuestionsService', () => {
  let service: ExamTestsAndQuestionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamTestsAndQuestionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
