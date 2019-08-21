import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassworddialogComponent } from './passworddialog.component';

describe('PassworddialogComponent', () => {
  let component: PassworddialogComponent;
  let fixture: ComponentFixture<PassworddialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassworddialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassworddialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
