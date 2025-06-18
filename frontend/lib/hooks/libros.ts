"use client";

import { useState, useEffect, useCallback } from "react";
import { Libro } from "@/lib/types/inventario/libro";

interface UseLibrosOptions {
  search?: string;
  limit?: number;
}

interface UseLibrosReturn {
  libros: Libro[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useLibros(options: UseLibrosOptions = {}): UseLibrosReturn {
  const { search = "", limit = 100 } = options;
  const [libros, setLibros] = useState<Libro[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLibros = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search) params.append("titulo", search);
      if (limit) params.append("limit", limit.toString());

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventario/libros/?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Error al cargar los libros");
      }

      const data = await response.json();
      setLibros(data.results || data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setLibros([]);
    } finally {
      setIsLoading(false);
    }
  }, [search, limit]);

  useEffect(() => {
    // Solo hacer fetch si el término de búsqueda está vacío o tiene al menos 2 caracteres
    if (search.length === 0 || search.length >= 2) {
      fetchLibros();
    } else {
      // Si el término es muy corto, limpiar los resultados pero no hacer loading
      setLibros([]);
      setError(null);
    }
  }, [search, fetchLibros]);

  return {
    libros,
    isLoading,
    error,
    refetch: fetchLibros,
  };
}