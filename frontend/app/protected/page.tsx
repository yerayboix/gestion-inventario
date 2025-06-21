import { PageHeader } from "@/components/page-header";

export default function ProtectedPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 py-10">
      <PageHeader 
        title="Página Protegida" 
        description="Esta es una página de prueba para verificar la autenticación"
      />
      <div>Protected Page</div>
    </div>
  )
}