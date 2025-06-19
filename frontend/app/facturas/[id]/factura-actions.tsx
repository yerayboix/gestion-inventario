"use client";

import { useState } from "react";
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
import { emitirFacturaAction, anularFacturaAction } from "@/lib/actions/facturas-actions";
import { toast } from "sonner";
import type { Factura } from "@/lib/types/facturacion/factura";

interface FacturaActionsProps {
  factura: Factura;
}

export function FacturaActions({ factura }: FacturaActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [motivoAnulacion, setMotivoAnulacion] = useState("");
  const [showAnularDialog, setShowAnularDialog] = useState(false);
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

  if (factura.estado === "borrador") {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button disabled={isLoading}>
            {isLoading ? "Emitiendo..." : "Emitir Factura"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Emitir factura?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción cambiará el estado de la factura de &quot;Borrador&quot; a &quot;Emitida&quot; y generará un número oficial de factura. 
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleEmitirFactura} disabled={isLoading}>
              {isLoading ? "Emitiendo..." : "Emitir Factura"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (factura.estado === "emitida") {
    return (
      <Dialog open={showAnularDialog} onOpenChange={setShowAnularDialog}>
        <DialogTrigger asChild>
          <Button variant="destructive" disabled={isLoading}>
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
              {isLoading ? "Anulando..." : "Anular Factura"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
} 