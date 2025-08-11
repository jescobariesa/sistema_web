import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsRegistro } from './forms-registro';

describe('FormsRegistro', () => {
  let component: FormsRegistro;
  let fixture: ComponentFixture<FormsRegistro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsRegistro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormsRegistro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
