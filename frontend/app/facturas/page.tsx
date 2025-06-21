import { Suspense } from "react";
import { columns } from "@/app/facturas/columns";
import { getFacturas } from "@/lib/data/facturacion/facturas";
import { SearchForm } from "@/app/facturas/search-form";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/plus";
import Link from "next/link";
import { FacturasSkeleton } from "./facturas-skeleton";

interface FacturasPageProps {
  searchParams: {
    page?: string;
    estado?: string;
    numero?: string;
  };
}

export default async function FacturasPage({ searchParams }: FacturasPageProps) {
  const { page, estado, numero } = await searchParams;
  const pageNumber = Number(page) || 1;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 py-10">
      <div className="grid grid-cols-1 @[400px]:grid-cols-2 @[800px]:grid-cols-3 @[1200px]:grid-cols-4 gap-2">
        <div className="col-span-4 @[400px]:col-span-4 @[800px]:col-span-4 @[1200px]:col-span-4">
          <h1 className="text-2xl font-bold">Facturas</h1>
          
          <div className="flex justify-between gap-2">
            <SearchForm defaultValue={numero || ""} />
            <Button asChild>
              <Link href="/facturas/nueva">
                <PlusIcon className="h-4 w-4" />
                <span className="hidden sm:block">Nueva factura</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Suspense key={`${pageNumber}-${estado}-${numero}`} fallback={<FacturasSkeleton />}>
        <FacturasTable page={pageNumber} estado={estado} numero={numero} />
      </Suspense>
    </div>
  );
}

async function FacturasTable({ page, estado, numero }: { page: number; estado?: string; numero?: string }) {
  const data = await getFacturas({ page, estado, numero });

  return (
    <DataTable
      columns={columns}
      data={data.results}
      pageCount={Math.ceil(data.count / 10)}
      currentPage={page}
      totalItems={data.count}
    />
  );
} 