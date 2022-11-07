import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationEditPageComponent } from './organisation-edit-page.component';

describe('OrganisationEditPageComponent', () => {
  let component: OrganisationEditPageComponent;
  let fixture: ComponentFixture<OrganisationEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationEditPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
