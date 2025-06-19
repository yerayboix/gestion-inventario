"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LineaFacturaForm } from "@/app/facturas/linea-factura-form";
import { CreateFacturaData } from "@/lib/types/facturacion/factura";
import { CreateLineaFacturaData } from "@/lib/types/facturacion/linea-factura";
import { createFacturaAction } from "@/lib/actions/facturas-actions";
import { Separator } from "@/components/ui/separator";

const facturaSchema = z.object({
  cliente: z.string().optional(),
  nombre: z.string().min(1, "El nombre es requerido"),
  nif: z.string().optional(),
  domicilio: z.string().optional(),
  cp_ciudad: z.string().optional(),
  telefono: z.string().optional(),
  notas: z.string().optional(),
});

type FacturaFormData = z.infer<typeof facturaSchema>;

interface FacturaFormProps {
  factura?: Partial<FacturaFormData>; // Para edición
}

export function FacturaForm({ factura }: FacturaFormProps) {
  const router = useRouter();
  const [lineas, setLineas] = useState<CreateLineaFacturaData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FacturaFormData>({
    resolver: zodResolver(facturaSchema),
    defaultValues: factura || {
      cliente: "",
      nombre: "",
      nif: "",
      domicilio: "",
      cp_ciudad: "",
      telefono: "",
      notas: "",
    },
  });

  const onSubmit = async (data: FacturaFormData) => {
    if (lineas.length === 0) {
      toast.error("Debe añadir al menos una línea a la factura");
      return;
    }

    setIsSubmitting(true);
    try {
      const facturaData: CreateFacturaData = {
        ...data,
        fecha: new Date().toISOString().split('T')[0], // Fecha actual
        estado: "borrador",
        lineas: lineas,
      };

      const result = await createFacturaAction(facturaData);

      if (result.success) {
        toast.success("Factura creada correctamente");
        router.push("/facturas");
      } else {
        toast.error(result.error || "Error al crear la factura");
      }
    } catch (error) {
      toast.error("Error al crear la factura");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddLinea = (linea: CreateLineaFacturaData) => {
    setLineas([...lineas, linea]);
  };

  const handleRemoveLinea = (index: number) => {
    const newLineas = [...lineas];
    newLineas.splice(index, 1);
    setLineas(newLineas);
  };

  const handleUpdateLinea = (index: number, linea: Partial<CreateLineaFacturaData>) => {
    const newLineas = [...lineas];
    newLineas[index] = { ...newLineas[index], ...linea };
    setLineas(newLineas);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Datos del cliente */}
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle>Datos del Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nif"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIF/CIF</FormLabel>
                    <FormControl>
                      <Input placeholder="NIF/CIF del cliente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="domicilio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domicilio</FormLabel>
                    <FormControl>
                      <Input placeholder="Dirección de facturación" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cp_ciudad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código Postal y Ciudad</FormLabel>
                    <FormControl>
                      <Input placeholder="CP y Ciudad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cliente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del cliente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="Teléfono de contacto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-4">
              <FormField
                control={form.control}
                name="notas"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Notas</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Notas adicionales..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        <Separator />
        {/* Líneas de factura */}
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle>Líneas de Factura</CardTitle>
          </CardHeader>
          <CardContent>
            <LineaFacturaForm
              lineas={lineas}
              onAddLinea={handleAddLinea}
              onRemoveLinea={handleRemoveLinea}
              onUpdateLinea={handleUpdateLinea}
            />
          </CardContent>
          {/* Botones de acción */}
          <div className="flex justify-end gap-2 px-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || lineas.length === 0}
            >
              {isSubmitting ? "Guardando..." : "Guardar Factura"}
            </Button>
          </div>
        </Card>


      </form>
    </Form>
  );
}