"use client";

import { useState, useEffect } from "react";
import { Factura, GetFacturasParams } from "@/lib/types/facturacion/factura";

interface UseFacturasReturn {
  facturas: Factura[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  totalCount: number;
}

export function useFacturas(params: GetFacturasParams = {}): UseFacturasReturn {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchFacturas = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();
      
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.pageSize) searchParams.append("page_size", params.pageSize.toString());
      if (params.numero) searchParams.append("numero", params.numero);
      if (params.cliente) searchParams.append("cliente", params.cliente);
      if (params.estado) searchParams.append("estado", params.estado);
      if (params.fecha_desde) searchParams.append("fecha_desde", params.fecha_desde);
      if (params.fecha_hasta) searchParams.append("fecha_hasta", params.fecha_hasta);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facturas/?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error("Error al cargar las facturas");
      }

      const data = await response.json();
      setFacturas(data.results || []);
      setTotalCount(data.count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFacturas();
  }, [
    params.page,
    params.pageSize,
    params.numero,
    params.cliente,
    params.estado,
    params.fecha_desde,
    params.fecha_hasta,
  ]);

  return {
    facturas,
    isLoading,
    error,
    refetch: fetchFacturas,
    totalCount,
  };
} 