import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserAuditComponent } from './admin-user-audit.component';

describe('AdminUserAuditComponent', () => {
  let component: AdminUserAuditComponent;
  let fixture: ComponentFixture<AdminUserAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminUserAuditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
