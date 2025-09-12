import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserinactivateComponent } from './userinactivate';

describe('Userinactivate', () => {
  let component: UserinactivateComponent;
  let fixture: ComponentFixture<UserinactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserinactivateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserinactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
