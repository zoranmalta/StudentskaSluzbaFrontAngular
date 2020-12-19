import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsSetComponent } from './questions-set.component';

describe('QuestionsSetComponent', () => {
  let component: QuestionsSetComponent;
  let fixture: ComponentFixture<QuestionsSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
