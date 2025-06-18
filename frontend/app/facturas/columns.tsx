"use client";
import Link from "next/link";
import type { Factura } from "@/lib/types/facturacion/factura";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileTextIcon } from "@/components/ui/file-text";
import type { ColumnDef } from "@tanstack/react-table";

const estadoVariants = {
  borrador: "draft",
  emitida: "issued",
  pagada: "paid",
  anulada: "cancelled",
} as const;

const estadoLabels = {
  borrador: "Borrador",
  emitida: "Emitida",
  pagada: "Pagada",
  anulada: "Anulada",
} as const;

export const columns: ColumnDef<Factura>[] = [
  {
    id: "numero",
    header: "Número",
    cell: ({ row }) => {
      const factura = row.original;
      const numero = factura.estado === "borrador" 
        ? factura.numero_borrador 
        : factura.numero;
      
      return (
        <span className="font-medium">
          {numero || "Sin número"}
        </span>
      );
    },
  },
  {
    accessorKey: "fecha",
    header: "Fecha",
  },
  {
    accessorKey: "cliente",
    header: "Cliente",
  },
  {
    accessorKey: "total",
    header: "Total",
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.getValue("estado") as Factura["estado"];
      return (
        <Badge variant={estadoVariants[estado]}>
          {estadoLabels[estado]}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const factura = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            asChild
          >
            <Link href={`/facturas/${factura.id}`}>
              <FileTextIcon className="h-4 w-4" />
              <span className="sr-only">Ver factura</span>
            </Link>
          </Button>
          
        </div>
      );
    },
  },
];