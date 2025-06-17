"use client";

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
import { deleteLibroAction } from "../../lib/actions/libros-actions";
import { useState } from "react";

interface DeleteLibroDialogProps {
  libroId: number;
  libroTitulo: string;
  onSuccess: () => void;
}

export function DeleteLibroDialog({ libroId, libroTitulo, onSuccess }: DeleteLibroDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    try {
      setIsLoading(true);
      const result = await deleteLibroAction(libroId);
      
      if (result.success) {
        toast.success("Libro eliminado correctamente");
        onSuccess();
        setOpen(false);
      } else {
        toast.error(result.error || "Error al eliminar el libro");
      }
    } catch {
      toast.error("Error al eliminar el libro");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-red-50">
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el libro &quot;{libroTitulo}&quot;.
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