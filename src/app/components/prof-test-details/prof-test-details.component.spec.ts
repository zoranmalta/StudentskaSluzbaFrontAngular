import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfTestDetailsComponent } from './prof-test-details.component';

describe('ProfTestDetailsComponent', () => {
  let component: ProfTestDetailsComponent;
  let fixture: ComponentFixture<ProfTestDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfTestDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfTestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
