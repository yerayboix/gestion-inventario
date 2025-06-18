"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LibroComboboxSimple } from "@/components/ui/libro-combobox-simple";
import { CreateLineaFacturaData } from "@/lib/types/facturacion/linea-factura";
import { Libro } from "@/lib/types/inventario/libro";

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

  const handleAddLinea = () => {
    if (!selectedLibro) return;

    const nuevaLinea: CreateLineaFacturaData = {
      libro: selectedLibro.id, // Solo el ID del libro
      cantidad,
      precio: selectedLibro.precio,
      descuento: null,
      importe: selectedLibro.precio * cantidad,
    };

    onAddLinea(nuevaLinea);

    // Reset form
    setSelectedLibro(null);
    setCantidad(1);
  };

  const handleCantidadChange = (index: number, newCantidad: number) => {
    const linea = lineas[index];
    const nuevoImporte = linea.precio * newCantidad;
    onUpdateLinea(index, { cantidad: newCantidad, importe: nuevoImporte });
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
        <div className="flex-1">
          <label className="text-sm font-medium">Seleccionar libro</label>
          <LibroComboboxSimple
            selectedLibro={selectedLibro}
            onLibroSelect={setSelectedLibro}
            placeholder="Buscar y seleccionar libro..."
          />
        </div>

        <div className="w-24">
          <label className="text-sm font-medium">Cantidad</label>
          <Input
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
          />
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
        <div className="p-3 bg-gray-50 rounded-md">
          <p className="text-sm">
            <strong>Libro seleccionado:</strong> {selectedLibro.titulo}
            <br />
            <strong>Precio:</strong> {selectedLibro.precio}€
            <br />
            <strong>Stock disponible:</strong> {selectedLibro.cantidad}
            <br />
            <strong>Total:</strong> {(selectedLibro.precio * cantidad).toFixed(2)}€
          </p>
        </div>
      )}

      {/* Tabla de líneas */}
      {lineas.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Libro ID</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Importe</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lineas.map((linea, index) => (
              <TableRow key={index}>
                <TableCell>{linea.libro}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="1"
                    value={linea.cantidad}
                    onChange={(e) => handleCantidadChange(index, parseInt(e.target.value) || 1)}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={linea.precio}
                    onChange={(e) => handlePrecioChange(index, parseFloat(e.target.value) || 0)}
                    className="w-24"
                  />
                </TableCell>
                <TableCell>{linea.importe?.toFixed(2)}€</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveLinea(index)}
                  >
                    Eliminar
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