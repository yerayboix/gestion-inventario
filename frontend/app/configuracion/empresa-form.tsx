"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getEmpresaAction, updateEmpresaAction, createEmpresaAction } from "@/lib/actions/empresa-actions";
import type { Empresa } from "@/lib/types/facturacion/empresa";

const empresaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  direccion: z.string().min(1, "La dirección es obligatoria"),
  nif: z.string().min(1, "El NIF es obligatorio"),
  gif: z.string().min(1, "El GIF es obligatorio"),
  iban: z.string().min(1, "El IBAN es obligatorio"),
});

type EmpresaFormData = z.infer<typeof empresaSchema>;

export function EmpresaForm() {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmpresaFormData>({
    resolver: zodResolver(empresaSchema),
  });

  useEffect(() => {
    loadEmpresa();
  }, []);

  const loadEmpresa = async () => {
    try {
      const result = await getEmpresaAction();
      if (result.success && result.data) {
        setEmpresa(result.data);
        reset(result.data);
      }
    } catch {
      toast.error("Error al cargar los datos de la empresa");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: EmpresaFormData) => {
    setIsSaving(true);
    try {
      let result;
      
      if (empresa) {
        // Actualizar empresa existente
        result = await updateEmpresaAction(data);
      } else {
        // Crear nueva empresa
        result = await createEmpresaAction(data);
      }

      if (result.success) {
        toast.success("Datos de la empresa guardados correctamente");
        // Recargar los datos para obtener el ID si es nueva
        await loadEmpresa();
      } else {
        toast.error(result.error || "Error al guardar los datos");
      }
    } catch {
      toast.error("Error al guardar los datos de la empresa");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre de la Empresa *</Label>
          <Input
            id="nombre"
            {...register("nombre")}
            placeholder="Mi Empresa S.L."
            className={errors.nombre ? "border-red-500" : ""}
          />
          {errors.nombre && (
            <p className="text-sm text-red-500">{errors.nombre.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nif">NIF/CIF *</Label>
          <Input
            id="nif"
            {...register("nif")}
            placeholder="B12345678"
            className={errors.nif ? "border-red-500" : ""}
          />
          {errors.nif && (
            <p className="text-sm text-red-500">{errors.nif.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="direccion">Dirección *</Label>
        <Textarea
          id="direccion"
          {...register("direccion")}
          placeholder="Calle Principal 123, 28001 Madrid"
          className={errors.direccion ? "border-red-500" : ""}
          rows={3}
        />
        {errors.direccion && (
          <p className="text-sm text-red-500">{errors.direccion.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gif">GIF *</Label>
          <Input
            id="gif"
            {...register("gif")}
            placeholder="12345678"
            className={errors.gif ? "border-red-500" : ""}
          />
          {errors.gif && (
            <p className="text-sm text-red-500">{errors.gif.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="iban">IBAN *</Label>
          <Input
            id="iban"
            {...register("iban")}
            placeholder="ES91 2100 0418 4502 0005 1332"
            className={errors.iban ? "border-red-500" : ""}
          />
          {errors.iban && (
            <p className="text-sm text-red-500">{errors.iban.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="text-sm text-muted-foreground">
          {empresa ? (
            <>
              Última actualización: {new Date(empresa.updated_on).toLocaleDateString('es-ES')}
            </>
          ) : (
            "No hay datos de empresa configurados"
          )}
        </div>
        
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
              Guardando...
            </>
          ) : (
            "Guardar Cambios"
          )}
        </Button>
      </div>
    </form>
  );
} 