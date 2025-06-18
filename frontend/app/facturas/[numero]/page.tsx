import { getFactura } from "@/lib/data/facturacion/facturas";

export default async function FacturaPage({ params }: { params: { numero: number } }) {
  const { numero } = await params;
  const factura = await getFactura(numero);

  return <div className="flex flex-1 flex-col gap-4 p-6 py-10">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Factura {factura.numero}</h1>
    </div>
  </div>;
}