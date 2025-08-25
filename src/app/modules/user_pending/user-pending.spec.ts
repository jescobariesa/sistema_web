import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPendingCommponent } from './user-pending';

describe('UserPending', () => {
  let component:UserPendingCommponent;
  let fixture: ComponentFixture<UserPendingCommponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPendingCommponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPendingCommponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
