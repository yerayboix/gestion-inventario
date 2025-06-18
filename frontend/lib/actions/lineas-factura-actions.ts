"use server";

import { createLineaFactura, updateLineaFactura, deleteLineaFactura } from "../data/facturacion/lineas-factura";
import { revalidatePath } from "next/cache";
import type { LineaFactura } from "@/lib/types/facturacion/linea-factura";
import type { ActionResponse } from "@/lib/types/common";

type CreateLineaFacturaParams = {
  factura: number;
  libro: number;
  cantidad: number;
  precio: number;
  descuento?: number | null;
};

export async function createLineaFacturaAction(values: CreateLineaFacturaParams): Promise<ActionResponse> {
  try {
    await createLineaFactura(values);
    revalidatePath("/facturas");
    return { success: true };
  } catch (error) {
    console.error('Error al crear la línea de factura:', error);
    return { success: false, error: "Error al crear la línea de factura" };
  }
}

export async function updateLineaFacturaAction(
  id: number,
  data: Partial<Omit<LineaFactura, 'id'>>
): Promise<ActionResponse> {
  try {
    await updateLineaFactura(id, data);
    revalidatePath("/facturas");
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar la línea de factura:', error);
    return { success: false, error: "Error al actualizar la línea de factura" };
  }
}

export async function deleteLineaFacturaAction(id: number): Promise<ActionResponse> {
  try {
    await deleteLineaFactura(id);
    revalidatePath("/facturas");
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar la línea de factura:', error);
    return { success: false, error: "Error al eliminar la línea de factura" };
  }
}
