import type { Libro } from "../inventario/libro";

export interface LineaFactura {
  id: number;
  factura: number;
  libro: Pick<Libro, 'id' | 'titulo' | 'precio' | 'descuento' | 'pvp' | 'cantidad'>;
  cantidad: number;
  precio: number;
  descuento: number | null;
  importe: number | null;
}

export interface CreateLineaFacturaData {
  libro: number; // Solo el ID del libro
  titulo: string;
  cantidad: number;
  precio: number;
  descuento?: number | null;
  importe?: number | null;
}

export interface UpdateLineaFacturaData {
  libro: number; // Solo el ID del libro
  cantidad: number;
  precio: number;
  descuento?: number | null;
}

export interface GetLineasFacturaParams {
  page?: number;
  pageSize?: number;
  factura_id?: number;
  libro_id?: number;
} 