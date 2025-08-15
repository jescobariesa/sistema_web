import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionUsuariosCommponent } from './gestion-usuarios';

describe('GestionUsuarios', () => {
  let component: GestionUsuariosCommponent;
  let fixture: ComponentFixture<GestionUsuariosCommponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionUsuariosCommponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionUsuariosCommponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
