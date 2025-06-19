"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLibros, useDebounce } from "@/lib/hooks";
import { Libro } from "@/lib/types/inventario/libro";
import { Book } from "lucide-react";

interface LibroComboboxSimpleProps {
  selectedLibro: Libro | null;
  onLibroSelect: (libro: Libro | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function LibroComboboxSimple({
  selectedLibro,
  onLibroSelect,
  placeholder = "Seleccionar libro...",
  disabled = false,
}: LibroComboboxSimpleProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showAbove, setShowAbove] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { libros, isLoading, error } = useLibros({
    search: debouncedSearchTerm,
    limit: 50,
    conStock: true,
  });

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!open && containerRef.current) {
      // Calcular si hay espacio suficiente abajo
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 300; // Altura estimada del dropdown
      
      setShowAbove(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
    }
    setOpen(!open);
  };

  const handleSelect = (libro: Libro, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onLibroSelect(libro);
    setOpen(false);
    setSearchTerm("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchTerm(e.target.value);
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Cerrar dropdown cuando se hace clic fuera
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearchTerm("");
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <Button
        type="button"
        variant="outline"
        onClick={handleToggle}
        className="w-full justify-between"
        disabled={disabled}
      >
        {selectedLibro ? (
          <span className="truncate flex items-center gap-2">
            <Book className="h-4 w-4 text-muted-foreground" />
            {selectedLibro.titulo}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Book className="h-4 w-4 text-muted-foreground" />
            {placeholder}
          </span>
        )}
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </Button>

      {open && (
        <div 
          className={`absolute left-0 right-0 border border-gray-300 rounded-md bg-white shadow-lg z-50 ${
            showAbove 
              ? 'bottom-full mb-1' 
              : 'top-full mt-1'
          }`}
        >
          <div className="p-2">
            <div className="relative">
              <Book className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar libro..."
                value={searchTerm}
                onChange={handleInputChange}
                onClick={handleInputClick}
                className="mb-2 pl-9"
                autoFocus
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {isLoading && <div className="p-2 text-sm text-gray-500">Buscando...</div>}
              {error && <div className="p-2 text-sm text-red-500">Error: {error}</div>}
              {!isLoading && !error && libros.length === 0 && (
                <div className="p-2 text-sm text-gray-500">
                  {searchTerm.length < 2 ? "Escribe al menos 2 caracteres..." : "No se encontraron libros"}
                </div>
              )}
              
              {libros.map((libro) => (
                <div
                  key={libro.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={(e) => handleSelect(libro, e)}
                >
                  <div className="font-medium">{libro.titulo}</div>
                  <div className="text-sm text-gray-500">
                    Precio: {libro.precio}€ | Stock: {libro.cantidad}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 