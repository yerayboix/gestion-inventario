"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { emitirFacturaAction, anularFacturaAction, deleteFacturaAction } from "@/lib/actions/facturas-actions";
import { toast } from "sonner";
import type { Factura } from "@/lib/types/facturacion/factura";
import { DeleteIcon, DeleteIconHandle } from "@/components/ui/delete";

interface FacturaActionsProps {
  factura: Factura;
}

export function FacturaActions({ factura }: FacturaActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [motivoAnulacion, setMotivoAnulacion] = useState("");
  const [showAnularDialog, setShowAnularDialog] = useState(false);
  const deleteIconRef = useRef<DeleteIconHandle>(null);
  const router = useRouter();

  const handleEmitirFactura = async () => {
    setIsLoading(true);
    try {
      const result = await emitirFacturaAction(factura.id.toString());
      
      if (result.success) {
        toast.success("Factura emitida correctamente");
        router.refresh();
      } else {
        toast.error(result.error || "Error al emitir la factura");
      }
    } catch {
      toast.error("Error al emitir la factura");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnularFactura = async () => {
    if (!motivoAnulacion.trim()) {
      toast.error("Debe especificar un motivo para la anulación");
      return;
    }

    setIsLoading(true);
    try {
      const result = await anularFacturaAction(factura.id.toString(), motivoAnulacion);
      
      if (result.success) {
        toast.success("Factura anulada correctamente");
        setShowAnularDialog(false);
        setMotivoAnulacion("");
        router.refresh();
      } else {
        toast.error(result.error || "Error al anular la factura");
      }
    } catch {
      toast.error("Error al anular la factura");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEliminarFactura = async () => {
    setIsLoading(true);
    try {
      const result = await deleteFacturaAction(factura.id.toString());
      
      if (result.success) {
        toast.success("Factura eliminada correctamente");
        router.push("/facturas");
      } else {
        toast.error(result.error || "Error al eliminar la factura");
      }
    } catch {
      toast.error("Error al eliminar la factura");
    } finally {
      setIsLoading(false);
    }
  };

  if (factura.estado === "borrador") {
    return (
      <div className="flex items-center gap-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              disabled={isLoading}
              variant="default"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Emitiendo...
                </>
              ) : (
                "Emitir Factura"
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Emitir factura?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción cambiará el estado de la factura de &quot;Borrador&quot; a &quot;Emitida&quot; y generará un número oficial de factura. 
                Una vez emitida, la factura no podrá ser modificada y solo podrá ser anulada.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleEmitirFactura} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Emitiendo...
                  </>
                ) : (
                  "Emitir Factura"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-red-50 border border-red-200"
              onMouseEnter={() => deleteIconRef.current?.startAnimation()}
              onMouseLeave={() => deleteIconRef.current?.stopAnimation()}
              disabled={isLoading}
            >
              <DeleteIcon ref={deleteIconRef} className="text-red-500" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar factura?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará permanentemente la factura y recuperará el stock de los libros. 
                Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleEliminarFactura} 
                disabled={isLoading}
                className="bg-red-500 hover:bg-red-600"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Eliminando...
                  </>
                ) : (
                  "Eliminar Factura"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  if (factura.estado === "emitida") {
    return (
      <Dialog open={showAnularDialog} onOpenChange={setShowAnularDialog}>
        <DialogTrigger asChild>
          <Button 
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? "Anulando..." : "Anular Factura"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Anular Factura</DialogTitle>
            <DialogDescription>
              Esta acción cambiará el estado de la factura a &quot;Anulada&quot; y recuperará el stock de los libros. 
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="motivo">Motivo de anulación *</Label>
              <Textarea
                id="motivo"
                placeholder="Especifique el motivo de la anulación..."
                value={motivoAnulacion}
                onChange={(e) => setMotivoAnulacion(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAnularDialog(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleAnularFactura}
              disabled={isLoading || !motivoAnulacion.trim()}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Anulando...
                </>
              ) : (
                "Anular Factura"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
} 