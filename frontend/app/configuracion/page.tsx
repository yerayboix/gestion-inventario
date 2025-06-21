import { Suspense } from "react";
import { EmpresaForm } from "@/app/configuracion/empresa-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";

export default function ConfiguracionPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 py-10">
      <PageHeader 
        title="Configuración" 
        description="Gestiona la configuración de tu empresa para las facturas"
      />

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