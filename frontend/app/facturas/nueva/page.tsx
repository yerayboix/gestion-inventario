import { Suspense } from "react";
import Link from "next/link";
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { FacturaForm } from "@/app/facturas/factura-form";

export default function NuevaFacturaPage() {
  return (
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
            <BreadcrumbPage>Nueva Factura</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Suspense fallback={<div>Cargando...</div>}>
        <FacturaForm />
      </Suspense>
    </div>
  );
}