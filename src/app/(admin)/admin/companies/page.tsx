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
    <main className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Empresas</h1>
        <p className="text-sm text-muted-foreground">Perfil: {role}</p>
      </header>

      {/* role passado explicitamente */}
      <CompanieCard role="admin" />
    </main>
  );
}
