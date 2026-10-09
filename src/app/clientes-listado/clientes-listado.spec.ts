import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesListado } from './clientes-listado';

describe('ClientesListado', () => {
  let component: ClientesListado;
  let fixture: ComponentFixture<ClientesListado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesListado],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientesListado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
