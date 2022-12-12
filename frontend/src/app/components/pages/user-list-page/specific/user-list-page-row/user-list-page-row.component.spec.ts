import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListPageRowComponent } from './user-list-page-row.component';

describe('UserListPageRowComponent', () => {
  let component: UserListPageRowComponent;
  let fixture: ComponentFixture<UserListPageRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserListPageRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListPageRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
