"use client";
import Link from "next/link";
import type { Factura } from "@/lib/types/facturacion/factura";
import { DeleteFacturaDialog } from "@/app/facturas/delete-factura-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
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
    accessorKey: "numero",
    header: "Número",
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
              <FileText className="h-4 w-4" />
              <span className="sr-only">Ver factura</span>
            </Link>
          </Button>
          <DeleteFacturaDialog factura={factura} />
        </div>
      );
    },
  },
];