"use server";

import { revalidatePath } from "next/cache";
import { CreateLineaFacturaData, UpdateLineaFacturaData } from "../types/facturacion/linea-factura";
import type { ActionResponse } from "@/lib/types/common";

export async function createLineaFacturaAction(facturaId: string, data: CreateLineaFacturaData): Promise<ActionResponse> {
  try {
    const requestData = {
      libro: data.libro,
      cantidad: data.cantidad,
      precio: data.precio,
      descuento: data.descuento,
      factura: Number(facturaId)
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/facturacion/lineas-factura/`,
      {
        method: 'POST',
        headers: {
          "X-API-Key": process.env.API_KEY || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', response.status, errorText);
      throw new Error(`Error al crear la línea de factura: ${response.status} - ${errorText}`);
    }

    revalidatePath(`/facturas/${facturaId}`);
    return { success: true };
  } catch (error) {
    console.error('Error al crear la línea de factura:', error);
    return { success: false, error: "Error al crear la línea de factura" };
  }
}

export async function updateLineaFacturaAction(id: string, data: UpdateLineaFacturaData, facturaId: string): Promise<ActionResponse> {
  try {
    const requestData = {
      libro: data.libro,
      cantidad: data.cantidad,
      precio: data.precio,
      descuento: data.descuento,
      factura: Number(facturaId)
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/facturacion/lineas-factura/${id}/`,
      {
        method: 'PUT',
        headers: {
          "X-API-Key": process.env.API_KEY || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', response.status, errorText);
      throw new Error(`Error al actualizar la línea de factura: ${response.status} - ${errorText}`);
    }

    revalidatePath(`/facturas`);
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar la línea de factura:', error);
    return { success: false, error: "Error al actualizar la línea de factura" };
  }
}

export async function deleteLineaFacturaAction(id: string): Promise<ActionResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/facturacion/lineas-factura/${id}/`,
      {
        method: 'DELETE',
        headers: {
          "X-API-Key": process.env.API_KEY || "",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar la línea de factura");
    }

    revalidatePath(`/facturas`);
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar la línea de factura:', error);
    return { success: false, error: "Error al eliminar la línea de factura" };
  }
}
