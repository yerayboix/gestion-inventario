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
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { updateLibroAction } from "../../lib/actions/libros-actions";

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

  async function onSubmit(values: FormValues) {
    const result = await updateLibroAction(libro.id, values);
    
    if (result.success) {
      toast.success("Libro actualizado correctamente");
      setOpen(false);
      onSuccess();
    } else {
      toast.error(result.error || "Error al actualizar el libro");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Libro</DialogTitle>
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pvp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PVP</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
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
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descuento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descuento (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="1" {...field} value={field.value ?? ""} />
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
                    <Input type="number" step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Guardar cambios
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 