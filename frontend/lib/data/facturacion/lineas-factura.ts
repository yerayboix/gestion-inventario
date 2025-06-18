"server-only"
import { requireUser } from "../user/require-user";
import type { PaginatedResponse } from "@/lib/types/common";
import type { LineaFactura, GetLineasFacturaParams } from "@/lib/types/facturacion/linea-factura";

export async function getLineasFactura({ 
  page = 1, 
  pageSize = 10,
  factura_id,
  libro_id,
}: GetLineasFacturaParams = {}) {
  await requireUser();
  
  const searchParams = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  });

  if (factura_id) searchParams.append('factura', factura_id.toString());
  if (libro_id) searchParams.append('libro', libro_id.toString());

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/facturacion/lineas-factura/?${searchParams.toString()}`,
    {
      headers: {
        "X-API-Key": process.env.API_KEY || "",
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al obtener las líneas de factura");
  }

  const data: PaginatedResponse<LineaFactura> = await response.json();
  return data;
}

export async function createLineaFactura(lineaFactura: {
  factura: number;
  libro: number;
  cantidad: number;
  precio: number;
  descuento?: number | null;
}) {
  await requireUser();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/facturacion/lineas-factura/`,
    {
      method: 'POST',
      headers: {
        "X-API-Key": process.env.API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lineaFactura),
    }
  );

  if (!response.ok) {
    throw new Error("Error al crear la línea de factura");
  }

  const data: LineaFactura = await response.json();
  return data;
}

export async function updateLineaFactura(id: number, lineaFactura: Partial<{
  cantidad: number;
  precio: number;
  descuento: number | null;
}>) {
  await requireUser();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/facturacion/lineas-factura/${id}/`,
    {
      method: 'PATCH',
      headers: {
        "X-API-Key": process.env.API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lineaFactura),
    }
  );

  if (!response.ok) {
    throw new Error("Error al actualizar la línea de factura");
  }

  const data: LineaFactura = await response.json();
  return data;
}

export async function deleteLineaFactura(id: number) {
  await requireUser();

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
}

export async function getLineaFactura(id: number) {
  await requireUser();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/facturacion/lineas-factura/${id}/`,
    {
      headers: {
        "X-API-Key": process.env.API_KEY || "",
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al obtener la línea de factura");
  }

  const data: LineaFactura = await response.json();
  return data;
}
