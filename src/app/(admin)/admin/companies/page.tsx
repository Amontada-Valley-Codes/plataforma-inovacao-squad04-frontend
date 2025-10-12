// app/(admin)/admin/companies/page.tsx
import CompanieCard from "@/components/companies/CompanieCard";
import { getUserRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminCompaniesPage() {
  const role = await getUserRole();

  if (role !== "admin") {
    return (
      <main className="p-6">
        <h1 className="text-lg font-semibold">403 • Acesso negado</h1>
        <p className="text-sm text-muted-foreground">
          Esta área é exclusiva para administradores.
        </p>
      </main>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      {/* mantém o mesmo nome do componente que já usas */}
      <CompanieCard role="admin" />
    </div>         
  );
}
