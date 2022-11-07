import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationSearchPageComponent } from './organisation-search-page.component';

describe('OrganisationSearchPageComponent', () => {
  let component: OrganisationSearchPageComponent;
  let fixture: ComponentFixture<OrganisationSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationSearchPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
