import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleDialogTemplateComponent } from './simple-dialog-template.component';

describe('SimpleDialogTemplateComponent', () => {
  let component: SimpleDialogTemplateComponent;
  let fixture: ComponentFixture<SimpleDialogTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleDialogTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleDialogTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
