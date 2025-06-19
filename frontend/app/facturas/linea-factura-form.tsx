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

interface LineaFacturaFormProps {
  lineas: CreateLineaFacturaData[];
  onAddLinea: (linea: CreateLineaFacturaData) => void;
  onRemoveLinea: (index: number) => void;
  onUpdateLinea: (index: number, linea: Partial<CreateLineaFacturaData>) => void;
}

export function LineaFacturaForm({
  lineas,
  onAddLinea,
  onRemoveLinea,
  onUpdateLinea,
}: LineaFacturaFormProps) {
  const [selectedLibro, setSelectedLibro] = useState<Libro | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const deleteIconRef = useRef<DeleteIconHandle | null>(null);

  const handleAddLinea = () => {
    if (!selectedLibro) return;

    // Validar que la cantidad no exceda el stock
    if (cantidad > selectedLibro.cantidad) {
      toast.error(`No hay suficiente stock. Máximo disponible: ${selectedLibro.cantidad} unidades`);
      return;
    }

    const nuevaLinea: CreateLineaFacturaData = {
      libro: selectedLibro.id, // Solo el ID del libro
      titulo: selectedLibro.titulo,
      cantidad,
      precio: selectedLibro.precio,
      descuento: null,
      importe: selectedLibro.precio * cantidad,
      stock: selectedLibro.cantidad, // Añadir el stock para validaciones futuras
    };

    onAddLinea(nuevaLinea);

    // Reset form
    setSelectedLibro(null);
    setCantidad(1);
  };

  const handleCantidadChange = (index: number, newCantidad: number) => {
    const linea = lineas[index];
    
    // Validar contra el stock disponible
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
                    Stock: {linea.stock || 0} unidades
                  </p>
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
          <div className="text-right">
            <p className="text-sm">
              <strong>Total líneas:</strong> {lineas.length}
            </p>
            <p className="text-lg font-semibold">
              <strong>Total factura:</strong> {lineas.reduce((sum, linea) => sum + (linea.importe || 0), 0).toFixed(2)}€
            </p>
          </div>
        </div>
      )}
    </div>
  );
}