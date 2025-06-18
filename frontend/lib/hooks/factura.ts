"use client";

import { useState, useEffect } from "react";
import { Factura } from "@/lib/types/facturacion/factura";

interface UseFacturaReturn {
  factura: Factura | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFactura(id: string | number): UseFacturaReturn {
  const [factura, setFactura] = useState<Factura | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFactura = async () => {
    if (!id) {
      setFactura(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facturas/${id}/`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Factura no encontrada");
        }
        throw new Error("Error al cargar la factura");
      }

      const data = await response.json();
      setFactura(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFactura();
  }, [id]);

  return {
    factura,
    isLoading,
    error,
    refetch: fetchFactura,
  };
} 