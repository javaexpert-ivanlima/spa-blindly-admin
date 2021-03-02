import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RichtableComponent } from './richtable.component';

describe('RichtableComponent', () => {
  let component: RichtableComponent;
  let fixture: ComponentFixture<RichtableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RichtableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RichtableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
