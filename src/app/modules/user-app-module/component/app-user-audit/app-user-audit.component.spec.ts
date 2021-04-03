import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUserAuditComponent } from './app-user-audit.component';

describe('AdminUserAuditComponent', () => {
  let component: AppUserAuditComponent;
  let fixture: ComponentFixture<AppUserAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppUserAuditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppUserAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
