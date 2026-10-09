export interface Cliente {
  id: number;
  name: string;
  taxId: string;
  address: string;
  email: string;
  phone: string;
}

export type ClienteDraft = Omit<Cliente, 'id'>;