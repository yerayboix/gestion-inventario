"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LibroComboboxSimple } from "@/components/ui/libro-combobox-simple";
import { DeleteIcon, DeleteIconHandle } from "@/components/ui/delete";
import { CreateLineaFacturaData } from "@/lib/types/facturacion/linea-factura";
import { Libro } from "@/lib/types/inventario/libro";
import { Euro, Package, Calculator, Book } from "lucide-react";
import { toast } from "sonner";

// Tipo extendido para manejar propiedades adicionales en el frontend
interface LineaFacturaWithStock extends CreateLineaFacturaData {
  stock?: number;
}

interface LineaFacturaFormProps {
  lineas: LineaFacturaWithStock[];
  onAddLinea: (linea: CreateLineaFacturaData) => void;
  onRemoveLinea: (index: number) => void;
  onUpdateLinea: (index: number, linea: Partial<CreateLineaFacturaData>) => void;
  descuentoGeneral: number;
  setDescuentoGeneral: (value: number) => void;
  ivaPorcentaje: number;
  setIvaPorcentaje: (value: number) => void;
  gastosEnvio: number;
  setGastosEnvio: (value: number) => void;
  recargoEquivalencia: number;
  setRecargoEquivalencia: (value: number) => void;
}

export function LineaFacturaForm({
  lineas,
  onAddLinea,
  onRemoveLinea,
  onUpdateLinea,
  descuentoGeneral,
  setDescuentoGeneral,
  ivaPorcentaje,
  setIvaPorcentaje,
  gastosEnvio,
  setGastosEnvio,
  recargoEquivalencia,
  setRecargoEquivalencia,
}: LineaFacturaFormProps) {
  const [selectedLibro, setSelectedLibro] = useState<Libro | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const deleteIconRef = useRef<DeleteIconHandle | null>(null);

  // Calcular totales
  const sumaYSigue = lineas.reduce((sum, linea) => sum + (linea.importe || 0), 0);
  const importeDescuento = sumaYSigue * (descuentoGeneral / 100);
  const baseIva = sumaYSigue - importeDescuento;
  const importeIva = baseIva * (ivaPorcentaje / 100);
  const subtotal = baseIva + importeIva;
  const importeRecargoEquivalencia = subtotal * (recargoEquivalencia / 100);
  const total = subtotal + gastosEnvio + importeRecargoEquivalencia;

  const handleAddLinea = () => {
    if (!selectedLibro) return;

    // Validar que la cantidad no exceda el stock
    if (cantidad > selectedLibro.cantidad) {
      toast.error(`No hay suficiente stock. Máximo disponible: ${selectedLibro.cantidad} unidades`);
      return;
    }

    const nuevaLinea: LineaFacturaWithStock = {
      libro: selectedLibro.id, // Solo el ID del libro
      titulo: selectedLibro.titulo,
      cantidad,
      precio: selectedLibro.precio,
      descuento: null,
      importe: selectedLibro.precio * cantidad,
      stock: selectedLibro.cantidad, // Stock para mostrar en la tabla
    };

    onAddLinea(nuevaLinea);

    // Reset form
    setSelectedLibro(null);
    setCantidad(1);
  };

  const handleCantidadChange = (index: number, newCantidad: number) => {
    const linea = lineas[index];
    
    // Obtener el stock de la propiedad adicional
    const stockDisponible = linea.stock || 999;
    
    if (newCantidad > stockDisponible) {
      toast.error(`No hay suficiente stock. Máximo disponible: ${stockDisponible} unidades`);
      return;
    }
    
    const nuevoImporte = linea.precio * newCantidad;
    onUpdateLinea(index, { cantidad: newCantidad, importe: nuevoImporte });
  };

  const handleCantidadInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCantidad = parseInt(e.target.value) || 1;
    
    if (selectedLibro && newCantidad > selectedLibro.cantidad) {
      toast.error(`No hay suficiente stock. Máximo disponible: ${selectedLibro.cantidad} unidades`);
      // No actualizar el estado, mantener el valor anterior
      return;
    }
    
    setCantidad(newCantidad);
  };

  const handlePrecioChange = (index: number, newPrecio: number) => {
    const linea = lineas[index];
    const nuevoImporte = newPrecio * linea.cantidad;
    onUpdateLinea(index, { precio: newPrecio, importe: nuevoImporte });
  };

  return (
    <div className="space-y-4">
      {/* Formulario para añadir nueva línea */}
      <div className="flex gap-2 items-end">
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-sm font-medium">Seleccionar libro</label>
          <LibroComboboxSimple
            selectedLibro={selectedLibro}
            onLibroSelect={setSelectedLibro}
            placeholder="Buscar y seleccionar libro..."
          />
        </div>

        <div className="w-24 flex flex-col gap-2">
          <label className="text-sm font-medium">Cantidad</label>
          <div className="relative">
            <Package className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              min="1"
              max={selectedLibro?.cantidad || 999}
              value={cantidad}
              onChange={handleCantidadInputChange}
              className="pl-9"
            />
          </div>
        </div>

        <Button 
          onClick={handleAddLinea}
          disabled={!selectedLibro}
        >
          Añadir
        </Button>
      </div>

      {/* Información del libro seleccionado */}
      {selectedLibro && (
        <div className="p-4 bg-accent rounded-lg relative">
          <p className="text-xs text-muted-foreground absolute top-2 left-3 font-medium">
            Libro seleccionado:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Book className="w-5 h-5" />
              <div>
                <p className="text-xs text-gray-600 font-medium">Título</p>
                <p className="text-sm font-semibold truncate">{selectedLibro.titulo}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Euro className="w-5 h-5" />
              <div>
                <p className="text-xs text-gray-600 font-medium">Precio</p>
                <p className="text-sm font-semibold">{selectedLibro.precio}€</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              <div>
                <p className="text-xs text-gray-600 font-medium">Stock</p>
                <p className="text-sm font-semibold">{selectedLibro.cantidad} unidades</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              <div>
                <p className="text-xs text-gray-600 font-medium">Total</p>
                <p className="text-sm font-semibold">{(selectedLibro.precio * cantidad).toFixed(2)}€</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de líneas */}
      {lineas.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>PVP</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Importe</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lineas.map((linea, index) => (
              <TableRow key={index}>
                <TableCell>{linea.titulo}</TableCell>
                <TableCell>
                  <div className="relative">
                    <Package className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min="1"
                      value={linea.cantidad}
                      onChange={(e) => handleCantidadChange(index, parseInt(e.target.value) || 1)}
                      className="w-20 pl-8"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Stock: {linea.stock || 'N/A'} unidades
                  </p>
                </TableCell>
                <TableCell>
                  {/* Mostrar PVP calculado pero no enviarlo al backend */}
                  {Math.round((linea.precio * (1 + (ivaPorcentaje / 100))) * 100) / 100}€
                </TableCell>
                <TableCell>
                  <div className="relative">
                    <Euro className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={linea.precio}
                      onChange={(e) => handlePrecioChange(index, parseFloat(e.target.value) || 0)}
                      className="w-24 pl-8"
                    />
                  </div>
                </TableCell>
                <TableCell>{linea.importe?.toFixed(2)}€</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-red-50"
                    onClick={() => onRemoveLinea(index)}
                    onMouseEnter={() => deleteIconRef.current?.startAnimation()}
                    onMouseLeave={() => deleteIconRef.current?.stopAnimation()}
                  >
                    <DeleteIcon ref={deleteIconRef} className="text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Totales */}
      {lineas.length > 0 && (
        <div className="flex justify-end">
          <div className="w-96 space-y-6 p-6 bg-muted/30 rounded-lg border">
            {/* Resumen de líneas */}
            <div className="text-center pb-4 border-b">
              <p className="text-sm text-muted-foreground">
                {lineas.length} {lineas.length === 1 ? 'línea' : 'líneas'}
              </p>
              <p className="text-2xl font-bold">
                {sumaYSigue.toFixed(2)}€
              </p>
              <p className="text-sm text-muted-foreground">Suma y sigue</p>
            </div>

            {/* Descuentos */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Descuento general:</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={descuentoGeneral}
                    onChange={(e) => setDescuentoGeneral(parseFloat(e.target.value) || 0)}
                    className="w-20 text-right"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
              
              {descuentoGeneral > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Descuento aplicado:</span>
                  <span className="font-medium text-red-600">-{importeDescuento.toFixed(2)}€</span>
                </div>
              )}
            </div>

            {/* Base imponible */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Base imponible:</span>
                <span className="font-semibold">{baseIva.toFixed(2)}€</span>
              </div>
            </div>

            {/* IVA */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">IVA:</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={ivaPorcentaje}
                    onChange={(e) => setIvaPorcentaje(parseFloat(e.target.value) || 0)}
                    className="w-20 text-right"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Importe IVA:</span>
                <span className="font-medium">{importeIva.toFixed(2)}€</span>
              </div>
            </div>

            {/* Subtotal */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Subtotal:</span>
                <span className="font-semibold">{subtotal.toFixed(2)}€</span>
              </div>
            </div>

            {/* Gastos de envío */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Gastos de envío:</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={gastosEnvio}
                    onChange={(e) => setGastosEnvio(parseFloat(e.target.value) || 0)}
                    className="w-24 text-right"
                  />
                  <span className="text-sm text-muted-foreground">€</span>
                </div>
              </div>
            </div>

            {/* Recargo de equivalencia */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Rec. Equivalencia:</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={recargoEquivalencia}
                    onChange={(e) => setRecargoEquivalencia(parseFloat(e.target.value) || 0)}
                    className="w-20 text-right"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
              
              {recargoEquivalencia > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Importe recargo:</span>
                  <span className="font-medium">{importeRecargoEquivalencia.toFixed(2)}€</span>
                </div>
              )}
            </div>

            {/* Total final */}
            <div className="border-t-2 border-primary pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">TOTAL:</span>
                <span className="text-2xl font-bold text-primary">{total.toFixed(2)}€</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}