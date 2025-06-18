"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Factura } from "@/lib/types/facturacion/factura";
import { deleteFacturaAction } from "@/lib/actions/facturas-actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteFacturaDialogProps {
  factura: Factura;
}

export function DeleteFacturaDialog({ factura }: DeleteFacturaDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const result = await deleteFacturaAction(factura.id);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Factura eliminada correctamente");
      router.refresh();
    } catch (error) {
      console.error("Error al eliminar la factura:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al eliminar la factura"
      );
    } finally {
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Eliminar factura</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente la
            factura {factura.numero || factura.id} y todas sus líneas asociadas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 