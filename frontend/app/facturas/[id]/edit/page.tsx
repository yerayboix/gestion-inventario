import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Suspense } from "react";
import FacturaFormWrapper from "./factura-form-wrapper";
import { PageHeader } from "@/components/page-header";

export default async function EditFacturaPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  return(
    <div className="flex flex-1 flex-col gap-4 p-6 py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/facturas">Facturas</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/facturas/${id}`}>Factura</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Editar Factura</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <PageHeader 
        title="Editar Factura" 
        description="Modifica los datos de la factura"
      />
      
      <Suspense fallback={<div>Cargando...</div>}>
        <FacturaFormWrapper id={id} />
      </Suspense>
    </div>
  )
}