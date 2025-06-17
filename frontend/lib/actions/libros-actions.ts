"use server";

import { updateLibro, deleteLibro } from "../data/inventario/libros";
import { revalidatePath } from "next/cache";

export async function updateLibroAction(
  id: number,
  data: {
    titulo: string;
    pvp: number;
    precio: number;
    descuento: number | null;
    cantidad: number;
  }
) {
  try {
    await updateLibro(id, data);
    revalidatePath("/libros");
    return { success: true };
  } catch {
    return { success: false, error: "Error al actualizar el libro" };
  }
}

export async function deleteLibroAction(id: number) {
  try {
    await deleteLibro(id);
    revalidatePath("/libros");
    return { success: true };
  } catch {
    return { success: false, error: "Error al eliminar el libro" };
  }
} 