import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationMembersPageComponent } from './organisation-members-page.component';

describe('OrganisationMembersPageComponent', () => {
  let component: OrganisationMembersPageComponent;
  let fixture: ComponentFixture<OrganisationMembersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationMembersPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationMembersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
