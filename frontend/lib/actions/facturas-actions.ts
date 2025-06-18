"use server";

import { revalidatePath } from "next/cache";
import { Factura, CreateFacturaData } from "../types/facturacion/factura";

export async function createFactura(data: CreateFacturaData) {
  const response = await fetch(`${process.env.API_URL}/api/v1/facturas/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al crear la factura");
  }

  revalidatePath("/facturas");
  return response.json();
}

export async function updateFactura(id: string, data: Partial<Factura>) {
  const response = await fetch(`${process.env.API_URL}/api/v1/facturas/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar la factura");
  }

  revalidatePath(`/facturas/${id}`);
  return response.json();
}

export async function emitirFactura(id: string) {
  const response = await fetch(`${process.env.API_URL}/api/v1/facturas/${id}/emitir/`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Error al emitir la factura");
  }

  revalidatePath(`/facturas/${id}`);
  return response.json();
}

export async function anularFactura(id: string, motivo: string) {
  const response = await fetch(`${process.env.API_URL}/api/v1/facturas/${id}/anular/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ motivo }),
  });

  if (!response.ok) {
    throw new Error("Error al anular la factura");
  }

  revalidatePath(`/facturas/${id}`);
  return response.json();
}