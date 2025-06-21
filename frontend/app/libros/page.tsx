import { Suspense } from "react";
import { columns } from "@/app/libros/columns";
import { getLibros } from "../../lib/data/inventario/libros";
import { SearchForm } from "@/app/libros/search-form";
import { DataTable } from "@/components/ui/data-table";
import { CreateLibroDialog } from "./create-libro-dialog";
import { LibrosSkeleton } from "./libros-skeleton";

interface LibrosPageProps {
  searchParams: {
    page?: string;
    titulo?: string;
  };
}

export default async function LibrosPage({ searchParams }: LibrosPageProps) {
  const { page, titulo } = await searchParams;
  const pageNumber = Number(page) || 1;
  const searchQuery = titulo || "";

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 py-10">
      <div className="grid grid-cols-1 @[400px]:grid-cols-2 @[800px]:grid-cols-3 @[1200px]:grid-cols-4 gap-2">
        <div className="col-span-4 @[400px]:col-span-4 @[800px]:col-span-4 @[1200px]:col-span-4">
          <h1 className="text-2xl font-bold">Libros</h1>
          
          <div className="flex justify-between gap-2">
            <SearchForm defaultValue={searchQuery} />
            <CreateLibroDialog />
          </div>
        </div>
      </div>

      <Suspense key={`${pageNumber}-${searchQuery}`} fallback={<LibrosSkeleton />}>
        <LibrosTable page={pageNumber} titulo={searchQuery} />
      </Suspense>
    </div>
  );
}

async function LibrosTable({ page, titulo }: { page: number; titulo: string }) {
  const data = await getLibros({ page, titulo });

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
