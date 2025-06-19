"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/utils";
import { EditLibroDialog } from "./edit-libro-dialog";
import { DeleteLibroDialog } from "./delete-libro-dialog";

export type Libro = {
  id: number;
  titulo: string;
  pvp: number;
  precio: number;
  descuento: number | null;
  cantidad: number;
};

export const columns: ColumnDef<Libro>[] = [
  {
    accessorKey: "titulo",
    header: "Título",
  },
  {
    accessorKey: "precio",
    header: "Precio",
    cell: ({ row }) => formatCurrency(row.getValue("precio")),
  },
  {
    accessorKey: "cantidad",
    header: "Cantidad",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const libro = row.original;
      return (
        <div className="flex items-center gap-2">
          <EditLibroDialog key={`edit-libro-${libro.id}`} libro={libro} onSuccess={() => {}} />
          <DeleteLibroDialog
            key={`delete-libro-${libro.id}`}
            libroId={libro.id}
            libroTitulo={libro.titulo}
            onSuccess={() => {}}
          />
        </div>
      );
    },
  },
]; 