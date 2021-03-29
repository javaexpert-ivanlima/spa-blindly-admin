import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAdminUsersComponent } from './list-admin-users.component';

describe('ListAdminUsersComponent', () => {
  let component: ListAdminUsersComponent;
  let fixture: ComponentFixture<ListAdminUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAdminUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAdminUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
