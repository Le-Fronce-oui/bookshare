import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgListPageRowComponent } from './org-list-page-row.component';

describe('OrgListPageRowComponent', () => {
  let component: OrgListPageRowComponent;
  let fixture: ComponentFixture<OrgListPageRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgListPageRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgListPageRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
