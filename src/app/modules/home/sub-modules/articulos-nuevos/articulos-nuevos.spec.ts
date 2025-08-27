import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticulosNuevosCommponent } from './articulos-nuevos';

describe('ArticulosNuevos', () => {
  let component: ArticulosNuevosCommponent;
  let fixture: ComponentFixture<ArticulosNuevosCommponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticulosNuevosCommponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticulosNuevosCommponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
