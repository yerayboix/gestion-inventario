"use client";
import { useState, useRef } from "react";
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
import { DeleteIcon, DeleteIconHandle } from "@/components/ui/delete";
import { toast } from "sonner";

interface DeleteFacturaDialogProps {
  factura: Factura;
}

export function DeleteFacturaDialog({ factura }: DeleteFacturaDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const deleteIconRef = useRef<DeleteIconHandle>(null);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const result = await deleteFacturaAction(factura.id);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Factura eliminada correctamente");
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error("Error al eliminar la factura:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al eliminar la factura"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="hover:bg-red-50"
          onMouseEnter={() => deleteIconRef.current?.startAnimation()}
          onMouseLeave={() => deleteIconRef.current?.stopAnimation()}
        >
          <DeleteIcon ref={deleteIconRef} className="text-red-500" />
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
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-red-500 hover:bg-red-600"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                Eliminando...
              </>
            ) : (
              "Eliminar"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 