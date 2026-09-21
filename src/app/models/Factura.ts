export interface FacturaItem {
  id?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total?: number;
}

export interface Factura {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;

  companyName: string;
  companyTaxId: string;
  companyAddress: string;
  companyEmail: string;

  customerName: string;
  customerTaxId: string;
  customerAddress: string;

  subtotal: number;
  taxTotal: number;
  total: number;
  estado: string;
  items: FacturaItem[];
}

export type FacturaDraft = Omit<Factura, 'id' | 'subtotal' | 'taxTotal' | 'total'> & {
  subtotal?: number;
  taxTotal?: number;
  total?: number;
};
