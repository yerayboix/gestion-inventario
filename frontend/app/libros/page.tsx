import { Suspense } from "react";
import { columns } from "@/app/libros/columns";
import { getLibros } from "../../lib/data/inventario/libros";
import { SearchForm } from "@/app/libros/search-form";
import { DataTable } from "@/components/ui/data-table";

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
    <div className="flex flex-1 flex-col gap-4 p-6 py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Libros</h1>
        <SearchForm defaultValue={searchQuery} />
      </div>
      <Suspense key={`${pageNumber}-${searchQuery}`} fallback={<div>Cargando...</div>}>
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
    />
  );
}
