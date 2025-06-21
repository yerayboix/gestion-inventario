import { getLibros } from "../lib/data/inventario/libros";
import { PageHeader } from "@/components/page-header";

export default async function Home() {
  const libros = await getLibros();
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 py-10">
      <PageHeader 
        title="Resumen trimestral de ventas" 
        description="Vista general de las ventas y el inventario"
      />
      <div className="flex justify-center items-center">
        <pre>{JSON.stringify(libros, null, 2)}</pre>
      </div>
    </div>
  );
}
