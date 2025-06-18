"server-only"
import { requireUser } from "../user/require-user";
import type { PaginatedResponse } from "@/lib/types/common";
import type { Factura, GetFacturasParams } from "@/lib/types/facturacion/factura";

export async function getFacturas({ 
  page = 1, 
  pageSize = 10, 
  numero,
  cliente,
  estado,
  fecha_desde,
  fecha_hasta,
}: GetFacturasParams = {}) {
  await requireUser();
  
  const searchParams = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  });

  if (numero) searchParams.append('numero', numero);
  if (cliente) searchParams.append('cliente', cliente);
  if (estado) searchParams.append('estado', estado);
  if (fecha_desde) searchParams.append('fecha_desde', fecha_desde);
  if (fecha_hasta) searchParams.append('fecha_hasta', fecha_hasta);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/facturacion/facturas/?${searchParams.toString()}`,
    {
      headers: {
        "X-API-Key": process.env.API_KEY || "",
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al obtener las facturas");
  }

  const data: PaginatedResponse<Factura> = await response.json();
  return data;
}

export async function createFactura(factura: Omit<Factura, 'id'>) {
  await requireUser();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/facturacion/facturas/`,
    {
      method: 'POST',
      headers: {
        "X-API-Key": process.env.API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(factura),
    }
  );

  if (!response.ok) {
    throw new Error("Error al crear la factura");
  }

  const data: Factura = await response.json();
  return data;
}

export async function updateFactura(id: number, factura: Partial<Omit<Factura, 'id'>>) {
  await requireUser();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/facturacion/facturas/${id}/`,
    {
      method: 'PATCH',
      headers: {
        "X-API-Key": process.env.API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(factura),
    }
  );

  if (!response.ok) {
    throw new Error("Error al actualizar la factura");
  }

  const data: Factura = await response.json();
  return data;
}

export async function deleteFactura(id: number) {
  await requireUser();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/facturacion/facturas/${id}/`,
    {
      method: 'DELETE',
      headers: {
        "X-API-Key": process.env.API_KEY || "",
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al eliminar la factura");
  }
}

export async function getFactura(id: number) {
  await requireUser();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/facturacion/facturas/${id}/`,
    {
      headers: {
        "X-API-Key": process.env.API_KEY || "",
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al obtener la factura");
  }

  const data: Factura = await response.json();
  return data;
}
