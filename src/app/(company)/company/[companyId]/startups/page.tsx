import StartupCard from "@/components/startup/StartupCard";
import { getUserRole, getCurrentUser } from "@/lib/auth";

type PageProps = { params: Promise<{ companyId: string }> }; // ⬅️ torne params um Promise

export default async function CompanyStartupsPage({ params }: PageProps) {
  const { companyId } = await params; // ⬅️ aguarde o params
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
      <h1 className="mb-4 text-xl font-semibold">
        Startups da empresa {companyIdNum}
      </h1>
      <StartupCard
        role={role}
        viewerCompanyId={viewerCompanyId}
        companyIdFilter={companyIdNum}
      />
    </div>
  );
}
