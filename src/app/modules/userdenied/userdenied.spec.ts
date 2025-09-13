import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserdeniedComponent } from './userdenied';

describe('Userdenied', () => {
  let component: UserdeniedComponent;
  let fixture: ComponentFixture<UserdeniedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserdeniedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserdeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
