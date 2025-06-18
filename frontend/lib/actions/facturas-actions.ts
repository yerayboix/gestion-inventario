"use server";

import { createFactura, updateFactura, deleteFactura } from "../data/facturacion/facturas";
import { revalidatePath } from "next/cache";
import type { Factura, EstadoFactura } from "@/lib/types/facturacion/factura";
import type { ActionResponse } from "@/lib/types/common";

export async function createFacturaAction(values: Omit<Factura, 'id'>): Promise<ActionResponse> {
  try {
    await createFactura(values);
    revalidatePath("/facturas");
    return { success: true };
  } catch (error) {
    console.error('Error al crear la factura:', error);
    return { success: false, error: "Error al crear la factura" };
  }
}

export async function updateFacturaAction(
  id: number,
  data: Partial<Omit<Factura, 'id'>>
): Promise<ActionResponse> {
  try {
    await updateFactura(id, data);
    revalidatePath("/facturas");
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar la factura:', error);
    return { success: false, error: "Error al actualizar la factura" };
  }
}

export async function deleteFacturaAction(id: number): Promise<ActionResponse> {
  try {
    await deleteFactura(id);
    revalidatePath("/facturas");
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar la factura:', error);
    return { success: false, error: "Error al eliminar la factura" };
  }
}

export async function cambiarEstadoFacturaAction(
  id: number, 
  estado: EstadoFactura,
  fecha_pago?: string
): Promise<ActionResponse> {
  try {
    const data: Partial<Omit<Factura, 'id'>> = { estado };
    if (estado === 'pagada' && fecha_pago) {
      data.fecha_pago = fecha_pago;
    }
    
    await updateFactura(id, data);
    revalidatePath("/facturas");
    return { success: true };
  } catch (error) {
    console.error('Error al cambiar el estado de la factura:', error);
    return { success: false, error: "Error al cambiar el estado de la factura" };
  }
}
