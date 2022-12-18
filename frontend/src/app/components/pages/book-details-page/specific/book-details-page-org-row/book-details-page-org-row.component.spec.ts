import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDetailsPageOrgRowComponent } from './book-details-page-org-row.component';

describe('BookDetailsPageOrgRowComponent', () => {
  let component: BookDetailsPageOrgRowComponent;
  let fixture: ComponentFixture<BookDetailsPageOrgRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookDetailsPageOrgRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookDetailsPageOrgRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
