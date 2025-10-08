import StartupCard from "@/components/startup/StartupCard";
import { getUserRole, getCurrentUser } from "@/lib/auth";

type PageProps = { params: { companyId: string } };

export default async function CompanyStartupsPage({ params }: PageProps) {
  const { companyId } = params;                // ✅ síncrono no Next <=14 (e ok no 15 tb)
  const companyIdNum = Number(companyId);

  const role = await getUserRole();
  const me = await getCurrentUser();

  // Para avaliador/usuario filtrar por própria empresa
  const meCompany =
    (me as any).companyId ?? (me as any).empresaId ?? undefined;
  const viewerCompanyId =
    role === "avaliador" || role === "usuario" ? meCompany : undefined;

  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Startups da empresa {companyIdNum}</h1>
      <StartupCard
        role={role}
        viewerCompanyId={viewerCompanyId}   // number | undefined
        companyIdFilter={companyIdNum}      // garante number
      />
    </div>
  );
}
