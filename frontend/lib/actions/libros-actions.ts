"use server";

import { updateLibro, deleteLibro, createLibro } from "../data/inventario/libros";
import type { Libro } from "@/lib/types/inventario/libro";
import type { ActionResponse } from "@/lib/types/common";
import { invalidateLibrosCache } from "../cache-utils";

export async function updateLibroAction(
  id: number,
  data: Partial<Libro>
): Promise<ActionResponse> {
  try {
    await updateLibro(id, data);
    await invalidateLibrosCache();
    return { success: true };
  } catch {
    return { success: false, error: "Error al actualizar el libro" };
  }
}

export async function deleteLibroAction(id: number): Promise<ActionResponse> {
  try {
    await deleteLibro(id);
    await invalidateLibrosCache();
    return { success: true };
  } catch {
    return { success: false, error: "Error al eliminar el libro" };
  }
}

export async function createLibroAction(values: Omit<Libro, 'id'>): Promise<ActionResponse> {
  try {
    await createLibro(values);
    await invalidateLibrosCache();
    return { success: true };
  } catch {
    return { success: false, error: "Error al crear el libro" };
  }
} 