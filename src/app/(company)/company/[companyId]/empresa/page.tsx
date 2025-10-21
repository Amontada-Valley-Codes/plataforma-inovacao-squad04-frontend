import CompanieCard from "@/components/companies/CompanieCard";
import { getCurrentUser, getUserRole } from "@/lib/auth";

type PageProps = {
  params: Promise<{ companyId: string }>;
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function CompanyEmpresaPage({ params }: PageProps) {
  const [{ companyId }, [me, role]] = await Promise.all([
    params,
    Promise.all([getCurrentUser(), getUserRole()]),
  ]);

  // 🔧 Garantir tipos compatíveis com o componente
  const safeRole = (role ?? undefined) as "admin" | "gestor" | "avaliador" | "usuario" | undefined;
  const safeViewerCompanyId = me?.companyId ?? undefined;

  return (
    <div className="w-full max-w-screen-lg mx-auto px-3 sm:px-4 md:px-6 py-4 overflow-x-hidden">
      <CompanieCard
        role={safeRole}
        companyId={companyId}
        autoOpen
        viewerCompanyId={safeViewerCompanyId}
      />
    </div>
  );
}
