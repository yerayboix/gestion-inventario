import type { Libro } from "../inventario/libro";

export interface LineaFactura {
  id: number;
  factura: number;
  libro: Pick<Libro, 'id' | 'titulo' | 'pvp' | 'precio' | 'descuento'>;
  cantidad: number;
  precio: number;
  descuento: number | null;
  importe: number | null;
}

export interface GetLineasFacturaParams {
  page?: number;
  pageSize?: number;
  factura_id?: number;
  libro_id?: number;
} 