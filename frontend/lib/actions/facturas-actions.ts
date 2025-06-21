"use server";

import { createFactura, updateFactura, emitirFactura, anularFactura, deleteFactura, downloadFacturaPDF } from "../data/facturacion/facturas";
import { Factura, CreateFacturaData } from "../types/facturacion/factura";
import type { ActionResponse } from "@/lib/types/common";
import { invalidateFacturasCache } from "../cache-utils";

export async function createFacturaAction(data: CreateFacturaData): Promise<ActionResponse> {
  try {
    await createFactura(data);
    await invalidateFacturasCache();
    return { success: true };
  } catch {
    return { success: false, error: "Error al crear la factura" };
  }
}

export async function updateFacturaAction(id: string, data: Partial<Factura>): Promise<ActionResponse> {
  try {
    await updateFactura(id, data);
    await invalidateFacturasCache();
    return { success: true };
  } catch {
    return { success: false, error: "Error al actualizar la factura" };
  }
}

export async function emitirFacturaAction(id: string): Promise<ActionResponse> {
  try {
    await emitirFactura(id);
    await invalidateFacturasCache();
    return { success: true };
  } catch {
    return { success: false, error: "Error al emitir la factura" };
  }
}

export async function anularFacturaAction(id: string, motivo: string): Promise<ActionResponse> {
  try {
    await anularFactura(id, motivo);
    await invalidateFacturasCache();
    return { success: true };
  } catch {
    return { success: false, error: "Error al anular la factura" };
  }
}

export async function deleteFacturaAction(id: string): Promise<ActionResponse> {
  try {
    await deleteFactura(id);
    await invalidateFacturasCache();
    return { success: true };
  } catch {
    return { success: false, error: "Error al eliminar la factura" };
  }
}

export async function downloadFacturaPDFAction(id: string, mostrarIban: boolean = false): Promise<{ success: boolean; blob?: Blob; error?: string }> {
  try {
    const blob = await downloadFacturaPDF(id, mostrarIban);
    return { success: true, blob };
  } catch {
    return { success: false, error: "Error al descargar el PDF de la factura" };
  }
}