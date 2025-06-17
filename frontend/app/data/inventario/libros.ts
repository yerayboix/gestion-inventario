"server-only"
import { requireUser } from "../user/require-user";

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface Libro {
  id: number;
  titulo: string;
  pvp: number;
  precio: number;
  descuento: number | null;
  cantidad: number;
}

interface GetLibrosParams {
  page?: number;
  pageSize?: number;
  titulo?: string;
}

export async function getLibros({ page = 1, pageSize = 10, titulo }: GetLibrosParams = {}) {
  // Ensure user is authenticated
  await requireUser();
  
  const searchParams = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  });

  if (titulo) {
    searchParams.append('titulo', titulo);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/inventario/libros/?${searchParams.toString()}`,
    {
      headers: {
        "X-API-Key": process.env.API_KEY || "",
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al obtener los libros");
  }

  const data: PaginatedResponse<Libro> = await response.json();
  return data;
}

export async function createLibro(libro: Omit<Libro, 'id'>) {
  await requireUser();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/inventario/libros/`,
    {
      method: 'POST',
      headers: {
        "X-API-Key": process.env.API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(libro),
    }
  );

  if (!response.ok) {
    throw new Error("Error al crear el libro");
  }

  const data: Libro = await response.json();
  return data;
}

export async function updateLibro(id: number, libro: Partial<Omit<Libro, 'id'>>) {
  await requireUser();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/inventario/libros/${id}/`,
    {
      method: 'PATCH',
      headers: {
        "X-API-Key": process.env.API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(libro),
    }
  );

  if (!response.ok) {
    throw new Error("Error al actualizar el libro");
  }

  const data: Libro = await response.json();
  return data;
}

export async function deleteLibro(id: number) {
  await requireUser();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/inventario/libros/${id}/`,
    {
      method: 'DELETE',
      headers: {
        "X-API-Key": process.env.API_KEY || "",
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al eliminar el libro");
  }
}