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
  search?: string;
}

export async function getLibros({ page = 1, pageSize = 10, search }: GetLibrosParams = {}) {
  // Ensure user is authenticated
  await requireUser();
  
  const searchParams = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  });

  if (search) {
    searchParams.append('search', search);
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