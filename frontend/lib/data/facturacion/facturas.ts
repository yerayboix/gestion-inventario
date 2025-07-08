"server-only"
import { requireUser } from "../user/require-user";
import type { PaginatedResponse } from "@/lib/types/common";
import type { Factura, CreateFacturaData } from "@/lib/types/facturacion/factura";

interface GetFacturasParams {
  page?: number;
  pageSize?: number;
  estado?: string;
  cliente?: string;
  numero?: string;
}

export async function getFacturas({ page = 1, pageSize = 10, estado, cliente, numero }: GetFacturasParams = {}) {
  // Ensure user is authenticated
  await requireUser();
  
  const searchParams = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  });

  if (estado) {
    searchParams.append('estado', estado);
  }

  if (cliente) {
    searchParams.append('cliente', cliente);
  }

  if (numero) {
    searchParams.append('numero', numero);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/facturacion/facturas/?${searchParams.toString()}`,
    {
      headers: {
        "X-API-Key": process.env.API_KEY || "",
        "Content-Type": "application/json",
      },
      cache: 'force-cache',
      next: { 
        revalidate: 60, // 1 minuto
        tags: ['facturas', 'lista']
      }
    }
  );

  if (!response.ok) {
    throw new Error("Error al obtener las facturas");
  }

  const data: PaginatedResponse<Factura> = await response.json();
  return data;
}

export async function getFactura(id: number) {
  await requireUser();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/facturacion/facturas/${id}/`,
    {
      headers: {
        "X-API-Key": process.env.API_KEY || "",
        "Content-Type": "application/json",
      }
    }
  );

  if (!response.ok) {
    throw new Error("Error al obtener la factura");
  }

  const data: Factura = await response.json();
  return data;
}

export async function createFactura(factura: CreateFacturaData) {
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
    const errorText = await response.text();
    console.error('Error response:', response.status, errorText);
    throw new Error(`Error al crear la factura: ${response.status} - ${errorText}`);
  }

  const data: Factura = await response.json();
  return data;
}

export async function updateFactura(id: string, factura: Partial<Factura>) {
  await requireUser();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/facturacion/facturas/${id}/`,
    {
      method: 'PUT',
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

export async function emitirFactura(id: string) {
  await requireUser();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/facturacion/facturas/${id}/emitir/`,
    {
      method: 'POST',
      headers: {
        "X-API-Key": process.env.API_KEY || "",
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al emitir la factura");
  }

  const data: Factura = await response.json();
  return data;
}

export async function anularFactura(id: string, motivo: string) {
  await requireUser();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/facturacion/facturas/${id}/anular/`,
    {
      method: 'POST',
      headers: {
        "X-API-Key": process.env.API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ motivo }),
    }
  );

  if (!response.ok) {
    throw new Error("Error al anular la factura");
  }

  const data: Factura = await response.json();
  return data;
}

export async function deleteFactura(id: string) {
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

  return true;
}

export async function downloadFacturaPDF(id: string, mostrarIban: boolean = false) {
  await requireUser();

  const searchParams = new URLSearchParams();
  if (mostrarIban) {
    searchParams.append('mostrar_iban', 'true');
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/facturacion/facturas/${id}/pdf/?${searchParams.toString()}`,
    {
      headers: {
        "X-API-Key": process.env.API_KEY || "",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al descargar el PDF de la factura");
  }

  const blob = await response.blob();
  return blob;
}
