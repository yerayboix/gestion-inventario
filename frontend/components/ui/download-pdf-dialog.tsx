"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DownloadIcon, DownloadIconHandle } from "@/components/ui/download";
import { downloadFacturaPDFAction } from "@/lib/actions/facturas-actions";
import { toast } from "sonner";

interface DownloadPDFDialogProps {
  facturaId: string;
  facturaNumero?: string;
  children?: React.ReactNode;
}

export function DownloadPDFDialog({ facturaId, facturaNumero, children }: DownloadPDFDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const downloadIconRef = useRef<DownloadIconHandle>(null);
  const handleDownload = async (mostrarIban: boolean) => {
    setIsLoading(true);
    try {
      const result = await downloadFacturaPDFAction(facturaId, mostrarIban);
      
      if (result.success && result.blob) {
        // Create a download link
        const url = window.URL.createObjectURL(result.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `factura_${facturaNumero || facturaId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success("PDF descargado correctamente");
        setOpen(false);
      } else {
        toast.error(result.error || "Error al descargar el PDF");
      }
    } catch {
      toast.error("Error al descargar el PDF");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" onMouseEnter={() => downloadIconRef.current?.startAnimation()} onMouseLeave={() => downloadIconRef.current?.stopAnimation()}>
            <DownloadIcon ref={downloadIconRef} />
            <span className="sr-only">Descargar PDF</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Descargar PDF de Factura</DialogTitle>
          <DialogDescription>
            ¿Cómo deseas descargar el PDF de la factura {facturaNumero || facturaId}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => handleDownload(false)}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Sin IBAN
          </Button>
          <Button
            onClick={() => handleDownload(true)}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Con IBAN
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 