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

// Función específica para búsqueda de libros (usada en combobox)
export async function searchLibrosAction(search: string, limit: number = 50, conStock: boolean = true): Promise<ActionResponse & { data?: Libro[] }> {
  try {
    const params = new URLSearchParams();
    if (search) params.append("titulo", search);
    if (limit) params.append("limit", limit.toString());
    if (conStock) params.append("cantidad_min", "1");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/inventario/libros/?${params.toString()}`,
      {
        headers: {
          "X-API-Key": process.env.API_KEY || "",
          "Content-Type": "application/json",
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error("Error al buscar libros");
    }

    const data = await response.json();
    return { success: true, data: data.results || data };
  } catch (error) {
    console.error('Error al buscar libros:', error);
    return { success: false, error: "Error al buscar libros", data: [] };
  }
} 