import { getFactura } from "@/lib/data/facturacion/facturas";
import { FacturaForm } from "../../factura-form";

export default async function FacturaFormWrapper({ id }: { id: string }) {
  const factura = await getFactura(Number(id));
  
  // Extract only the properties that FacturaForm expects
  const facturaForForm = {
    fecha: new Date(factura.fecha),
    nombre: factura.nombre || "",
    cliente: factura.cliente || undefined,
    nif: factura.nif || undefined,
    domicilio: factura.domicilio || undefined,
    cp_ciudad: factura.cp_ciudad || undefined,
    telefono: factura.telefono || undefined,
    notas: factura.notas || undefined,
  };
  
  return (
    <div className="flex flex-1 flex-col gap-4 p-6 py-10">
      <FacturaForm factura={facturaForForm} />
    </div>
  )
}