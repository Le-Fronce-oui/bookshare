import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationDetailsPageComponent } from './organisation-details-page.component';

describe('OrganisationDetailsPageComponent', () => {
  let component: OrganisationDetailsPageComponent;
  let fixture: ComponentFixture<OrganisationDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationDetailsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
