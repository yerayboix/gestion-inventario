import { Suspense } from "react";
import { EmpresaForm } from "@/app/configuracion/empresa-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ConfiguracionPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">
          Gestiona la configuración de tu empresa para las facturas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos de la Empresa</CardTitle>
          <CardDescription>
            Configura los datos que aparecerán en tus facturas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<EmpresaFormSkeleton />}>
            <EmpresaForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

function EmpresaFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  );
} 