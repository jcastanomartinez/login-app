export interface Cliente {
  id: number;
  taxId: string,
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion: string;
  creadoEn: string;
  actualizadoEn: string;     
}

export type ClienteDraft = Omit<Cliente, 'id'>;