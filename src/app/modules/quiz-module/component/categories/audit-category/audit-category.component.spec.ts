import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditCategoryComponent } from './audit-category.component';

describe('AuditCategoryComponent', () => {
  let component: AuditCategoryComponent;
  let fixture: ComponentFixture<AuditCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
