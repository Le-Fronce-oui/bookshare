import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgMembersPageRowComponent } from './org-members-page-row.component';

describe('OrgMembersPageRowComponent', () => {
  let component: OrgMembersPageRowComponent;
  let fixture: ComponentFixture<OrgMembersPageRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgMembersPageRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgMembersPageRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
