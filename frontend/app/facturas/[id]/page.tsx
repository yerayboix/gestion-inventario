
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFactura } from "@/lib/data/facturacion/facturas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FacturaPageProps {
  params: Promise<{
    id: number;
  }>;
}

export default async function FacturaPage({ params }: FacturaPageProps) {
  const { id } = await params;
  const factura = await getFactura(id);

  if (!factura) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-6 py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Factura {factura.numero}</h1>
        <div className="flex gap-2">
          {factura.estado === "borrador" && (
            <>
              <Button asChild variant="outline">
                <Link href={`/facturas/${factura.id}/edit`}>Editar</Link>
              </Button>
              <Button>Emitir Factura</Button>
            </>
          )}
          {factura.estado === "emitida" && (
            <Button variant="destructive">Anular Factura</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Detalles de la factura */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Datos del Cliente</h2>
          {/* ... detalles del cliente ... */}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Detalles de la Factura</h2>
          {/* ... detalles de la factura ... */}
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Líneas de Factura</h2>
        {/* ... tabla de líneas ... */}
      </Card>
    </div>
  );
}