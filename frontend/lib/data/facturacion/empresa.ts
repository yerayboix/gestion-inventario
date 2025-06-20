"server-only"
import { requireUser } from "../user/require-user";
import type { Empresa, UpdateEmpresaData } from "@/lib/types/facturacion/empresa";

export async function getEmpresa(): Promise<Empresa> {
  // Ensure user is authenticated
  await requireUser();
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/facturacion/empresa/`,
    {
      headers: {
        "X-API-Key": process.env.API_KEY || "",
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al obtener los datos de la empresa");
  }

  return response.json();
}

export async function updateEmpresa(data: UpdateEmpresaData): Promise<Empresa> {
  // Ensure user is authenticated
  await requireUser();
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/facturacion/empresa/1/`,
    {
      method: 'PUT',
      headers: {
        "X-API-Key": process.env.API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Error al actualizar los datos de la empresa");
  }

  return response.json();
}

export async function createEmpresa(data: UpdateEmpresaData): Promise<Empresa> {
  // Ensure user is authenticated
  await requireUser();
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/facturacion/empresa/`,
    {
      method: 'POST',
      headers: {
        "X-API-Key": process.env.API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Error al crear los datos de la empresa");
  }

  return response.json();
} 