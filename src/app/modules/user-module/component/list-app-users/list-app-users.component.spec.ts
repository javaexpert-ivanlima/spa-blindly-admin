import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAppUsersComponent } from './list-app-users.component';

describe('ListAppUsersComponent', () => {
  let component: ListAppUsersComponent;
  let fixture: ComponentFixture<ListAppUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAppUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAppUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
