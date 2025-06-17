"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Percent, Package, Pencil, Save, Edit, Euro } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { updateLibroAction } from "../../lib/actions/libros-actions";
import React from "react";

const formSchema = z.object({
  titulo: z.string().min(1, "El título es requerido"),
  pvp: z.coerce.number().min(0, "El PVP debe ser mayor o igual a 0"),
  precio: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
  descuento: z.coerce.number().min(0).max(100).nullable(),
  cantidad: z.coerce.number().int().min(0, "La cantidad debe ser mayor o igual a 0"),
});

type FormValues = z.infer<typeof formSchema>;

interface EditLibroDialogProps {
  libro: {
    id: number;
    titulo: string;
    pvp: number;
    precio: number;
    descuento: number | null;
    cantidad: number;
  };
  onSuccess: () => void;
}

export function EditLibroDialog({ libro, onSuccess }: EditLibroDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: libro.titulo,
      pvp: libro.pvp,
      precio: libro.precio,
      descuento: libro.descuento,
      cantidad: libro.cantidad,
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        titulo: libro.titulo,
        pvp: libro.pvp,
        precio: libro.precio,
        descuento: libro.descuento,
        cantidad: libro.cantidad,
      });
    }
  }, [open, libro, form]);

  async function onSubmit(values: FormValues) {
    try {
      setIsLoading(true);
      const result = await updateLibroAction(libro.id, values);
      
      if (result.success) {
        toast.success("Libro actualizado correctamente");
        setOpen(false);
        onSuccess();
      } else {
        toast.error(result.error || "Error al actualizar el libro");
      }
    } catch {
      toast.error("Error al actualizar el libro");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Edit className="h-5 w-5 text-primary" />
            Editar Libro
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input {...field} className="pl-9" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pvp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PVP</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Euro className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="number" step="0.01" {...field} className="pl-9" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="precio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Euro className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="number" step="0.01" {...field} className="pl-9" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="descuento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descuento</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Percent className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="number" step="1" {...field} value={field.value ?? ""} className="pl-9" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cantidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Package className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="number" step="1" {...field} className="pl-9" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="gap-2"
                disabled={!form.formState.isDirty || isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Guardar
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 