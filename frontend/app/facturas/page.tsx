import { Suspense } from "react";
import { columns } from "@/app/facturas/columns";
import { getFacturas } from "@/lib/data/facturacion/facturas";
import { SearchForm } from "@/app/facturas/search-form";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/plus";
import Link from "next/link";

interface FacturasPageProps {
  searchParams: {
    page?: string;
    numero?: string;
  };
}

export default async function FacturasPage({ searchParams }: FacturasPageProps) {
  const { page, numero } = await searchParams;
  const pageNumber = Number(page) || 1;
  const searchQuery = numero || "";

  return (
    <div className="flex flex-1 flex-col gap-4 p-6 py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Facturas</h1>
        <div className="flex items-center gap-1">
          <SearchForm defaultValue={searchQuery} />
          <Button asChild>
            <Link href="/facturas/nueva">
              <PlusIcon className="h-4 w-4 mr-2" />
              Nueva factura
            </Link>
          </Button>
        </div>
      </div>
      <Suspense key={`${pageNumber}-${searchQuery}`} fallback={<div>Cargando...</div>}>
        <FacturasTable page={pageNumber} numero={searchQuery} />
      </Suspense>
    </div>
  );
}

async function FacturasTable({ page, numero }: { page: number; numero: string }) {
  const data = await getFacturas({ page, numero });

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