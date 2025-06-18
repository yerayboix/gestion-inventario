import type { LineaFactura } from "../facturacion/linea-factura";

export type EstadoFactura = "borrador" | "emitida" | "pagada" | "anulada";

export interface Factura {
  id: number;
  numero: string | null;
  fecha: string;
  cliente: string | null;
  nombre: string | null;
  nif: string | null;
  domicilio: string | null;
  cp_ciudad: string | null;
  telefono: string | null;
  descuento: number | null;
  base_iva: number | null;
  iva: number | null;
  recargo_equivalencia: number | null;
  total: number | null;
  notas: string | null;
  estado: EstadoFactura;
  fecha_pago: string | null;
  motivo_anulacion: string | null;
  fecha_anulacion: string | null;
  lineas: LineaFactura[];
}

export interface CreateFacturaData {
  fecha: string;
  cliente: string;
  nombre?: string;
  nif?: string;
  domicilio?: string;
  cp_ciudad?: string;
  telefono?: string;
  descuento?: number;
  base_iva?: number;
  iva?: number;
  recargo_equivalencia?: number;
  total?: number;
  notas?: string;
  estado: EstadoFactura;
  lineas: Omit<LineaFactura, 'id' | 'factura'>[];
}

export interface GetFacturasParams {
  page?: number;
  pageSize?: number;
  numero?: string;
  cliente?: string;
  estado?: EstadoFactura;
  fecha_desde?: string;
  fecha_hasta?: string;
} 