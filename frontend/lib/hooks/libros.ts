"use client";

import { useState, useEffect, useCallback } from "react";
import { Libro } from "@/lib/types/inventario/libro";
import { searchLibrosAction } from "../actions/libros-actions";

interface UseLibrosOptions {
  search?: string;
  limit?: number;
  conStock?: boolean;
}

interface UseLibrosReturn {
  libros: Libro[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useLibros(options: UseLibrosOptions = {}): UseLibrosReturn {
  const { search = "", limit = 100, conStock = true } = options;
  const [libros, setLibros] = useState<Libro[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLibros = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await searchLibrosAction(search, limit, conStock);
      
      if (result.success && result.data) {
        setLibros(result.data);
      } else {
        setError(result.error || "Error desconocido");
        setLibros([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setLibros([]);
    } finally {
      setIsLoading(false);
    }
  }, [search, limit, conStock]);

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