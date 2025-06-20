import Link from "next/link";
import { notFound } from "next/navigation";
import { getFactura } from "@/lib/data/facturacion/facturas";
import { getLineasFactura } from "@/lib/data/facturacion/lineas-factura";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { FacturaActions } from "@/app/facturas/[id]/factura-actions";

interface FacturaPageProps {
  params: Promise<{
    id: number;
  }>;
}

export default async function FacturaPage({ params }: FacturaPageProps) {
  const { id } = await params;
  const factura = await getFactura(id);
  const lineas = await getLineasFactura(id);

  if (!factura) {
    notFound();
  }

  // Calcular totales para mostrar
  const sumaYSigue = lineas?.reduce((sum, linea) => sum + Number(linea.importe || 0), 0) || 0;
  const descuento = Number(factura.descuento || 0);
  const iva = Number(factura.iva || 0);
  const gastosEnvio = Number(factura.gastos_envio || 0);

  const importeDescuento = sumaYSigue * (descuento / 100);
  const baseIva = sumaYSigue - importeDescuento;
  const importeIva = baseIva * (iva / 100);
  const subtotal = baseIva + importeIva;
  const totalCalculado = subtotal + gastosEnvio;

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'borrador': return 'bg-gray-100 text-gray-800';
      case 'emitida': return 'bg-blue-100 text-blue-800';
      case 'pagada': return 'bg-green-100 text-green-800';
      case 'anulada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/facturas">Facturas</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Detalles de la factura</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {factura.numero || factura.numero_borrador}
            </h1>
            <p className="text-muted-foreground">
              Fecha: {new Date(factura.fecha).toLocaleDateString('es-ES')}
            </p>
          </div>
          <Badge className={`${getEstadoColor(factura.estado)} text-lg px-4 py-2`}>
            {factura.estado.toUpperCase()}
          </Badge>
        </div>
        <div className="flex gap-2">
          {factura.estado === "borrador" && (
            <>
              <Button asChild variant="outline">
                <Link href={`/facturas/${factura.id}/edit`}>Editar</Link>
              </Button>
              <FacturaActions factura={factura} />
            </>
          )}
          {factura.estado === "emitida" && (
            <FacturaActions factura={factura} />
          )}
        </div>
      </div>

      {/* Datos del cliente */}
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Datos del Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nombre *</label>
              <p className="text-sm">{factura.nombre || 'No especificado'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">NIF/CIF</label>
              <p className="text-sm">{factura.nif || 'No especificado'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Domicilio</label>
              <p className="text-sm">{factura.domicilio || 'No especificado'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Código Postal y Ciudad</label>
              <p className="text-sm">{factura.cp_ciudad || 'No especificado'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Cliente</label>
              <p className="text-sm">{factura.cliente || 'No especificado'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
              <p className="text-sm">{factura.telefono || 'No especificado'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notas o Motivo de Anulación */}
      {(factura.notas || factura.estado === 'anulada') && (
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle>
              {factura.estado === 'anulada' ? 'Motivo de Anulación' : 'Notas'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">
              {factura.estado === 'anulada' 
                ? (factura.motivo_anulacion || 'No se especificó motivo de anulación')
                : factura.notas
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Líneas de factura */}
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Líneas de Factura</CardTitle>
        </CardHeader>
        <CardContent>
          {lineas && lineas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/2">Título</TableHead>
                  <TableHead className="text-center">Cantidad</TableHead>
                  <TableHead className="text-center">PVP</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-right">Importe</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineas.map((linea) => (
                  <TableRow key={linea.id}>
                    <TableCell className="font-medium">{linea.libro.titulo}</TableCell>
                    <TableCell className="text-center">{linea.cantidad}</TableCell>
                    <TableCell className="text-center">{formatCurrency(Number(linea.libro.precio) * (1 + iva / 100))}</TableCell>
                    <TableCell className="text-right">{formatCurrency(Number(linea.precio))}</TableCell>
                    <TableCell className="text-right">{formatCurrency(Number(linea.importe) || 0)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">No hay líneas en esta factura</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Totales */}
      {lineas && lineas.length > 0 && (
        <div className="flex justify-end">
          <div className="w-96 space-y-6 p-6 bg-muted/30 rounded-lg border">
            {/* Resumen de líneas */}
            <div className="text-center pb-4 border-b">
              <p className="text-sm text-muted-foreground">
                {lineas.length} {lineas.length === 1 ? 'línea' : 'líneas'}
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(sumaYSigue)}
              </p>
              <p className="text-sm text-muted-foreground">Suma y sigue</p>
            </div>

            {/* Descuentos */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Descuento general:</span>
                <span className="font-medium">{descuento}%</span>
              </div>
              {descuento > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Descuento aplicado:</span>
                  <span className="font-medium text-red-600">-{formatCurrency(importeDescuento)}</span>
                </div>
              )}
            </div>
            {/* Base imponible */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Base imponible:</span>
                <span className="font-semibold">{formatCurrency(baseIva)}</span>
              </div>
            </div>

            {/* IVA */}
            {iva > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IVA:</span>
                  <span className="font-medium">{iva}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Importe IVA:</span>
                  <span className="font-medium">{formatCurrency(importeIva)}</span>
                </div>
              </div>
            )}

            {/* Subtotal */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Subtotal:</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
            </div>

            {/* Gastos de envío */}
            {gastosEnvio > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gastos de envío:</span>
                  <span className="font-medium">{formatCurrency(gastosEnvio)}</span>
                </div>
              </div>
            )}

            {/* Total final */}
            <div className="border-t-2 border-primary pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">TOTAL:</span>
                <span className="text-2xl font-bold text-primary">{formatCurrency(Number(factura.total) || totalCalculado)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}