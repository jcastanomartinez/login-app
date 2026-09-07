import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturasListado } from './facturas-listado';

describe('FacturasListado', () => {
  let component: FacturasListado;
  let fixture: ComponentFixture<FacturasListado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturasListado],
    }).compileComponents();

    fixture = TestBed.createComponent(FacturasListado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
