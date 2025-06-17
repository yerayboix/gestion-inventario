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

interface DeleteLibroDialogProps {
  libroId: number;
  libroTitulo: string;
  onSuccess: () => void;
}

export function DeleteLibroDialog({ libroId, libroTitulo, onSuccess }: DeleteLibroDialogProps) {
  async function handleDelete() {
    const result = await deleteLibroAction(libroId);
    
    if (result.success) {
      toast.success("Libro eliminado correctamente");
      onSuccess();
    } else {
      toast.error(result.error || "Error al eliminar el libro");
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4" />
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
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 