"use server";

import { getEmpresa, updateEmpresa, createEmpresa } from "../data/facturacion/empresa";
import type { UpdateEmpresaData, Empresa } from "../types/facturacion/empresa";
import type { ActionResponse } from "@/lib/types/common";
import { invalidateEmpresaCache } from "../cache-utils";

export async function getEmpresaAction(): Promise<ActionResponse & { data?: Empresa }> {
  try {
    const empresa = await getEmpresa();
    return { success: true, data: empresa };
  } catch {
    return { success: false, error: "Error al obtener los datos de la empresa" };
  }
}

export async function updateEmpresaAction(data: UpdateEmpresaData): Promise<ActionResponse> {
  try {
    await updateEmpresa(data);
    await invalidateEmpresaCache();
    return { success: true };
  } catch {
    return { success: false, error: "Error al actualizar los datos de la empresa" };
  }
}

export async function createEmpresaAction(data: UpdateEmpresaData): Promise<ActionResponse> {
  try {
    await createEmpresa(data);
    await invalidateEmpresaCache();
    return { success: true };
  } catch {
    return { success: false, error: "Error al crear los datos de la empresa" };
  }
} 