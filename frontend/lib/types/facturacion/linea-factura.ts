import type { Libro } from "../inventario/libro";

export interface LineaFactura {
  id: number;
  factura: number;
  libro: Pick<Libro, 'id' | 'titulo' | 'precio' | 'descuento'>;
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
  stock?: number; // Stock disponible para validaciones
}

export interface GetLineasFacturaParams {
  page?: number;
  pageSize?: number;
  factura_id?: number;
  libro_id?: number;
} 