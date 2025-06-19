import { getFactura } from "@/lib/data/facturacion/facturas";
import { FacturaEditarForm } from "./factura-editar-form";

export default async function FacturaFormWrapper({ id }: { id: string }) {
  const factura = await getFactura(Number(id));
  
  return (
    <div className="flex flex-1 flex-col gap-4 p-6 py-10">
      <FacturaEditarForm factura={factura} facturaId={id} />
    </div>
  )
}