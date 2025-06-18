export interface Libro {
  id: number;
  titulo: string;
  pvp: number;
  precio: number;
  descuento: number | null;
  cantidad: number;
}