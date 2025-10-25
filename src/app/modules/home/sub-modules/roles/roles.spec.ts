import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesCommponent } from './roles';

describe('Roles', () => {
  let component: RolesCommponent;
  let fixture: ComponentFixture<RolesCommponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesCommponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesCommponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
