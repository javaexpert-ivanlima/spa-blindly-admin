import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizOrderComponent } from './quiz-order.component';

describe('QuizOrderComponent', () => {
  let component: QuizOrderComponent;
  let fixture: ComponentFixture<QuizOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
