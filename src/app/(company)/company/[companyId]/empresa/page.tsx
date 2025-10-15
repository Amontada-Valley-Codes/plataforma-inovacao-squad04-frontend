// app/(company)/company/[companyId]/empresa/page.tsx
import CompanieCard from "@/components/companies/CompanieCard";
import { getCurrentUser, getUserRole } from "@/lib/auth";

type PageProps = {
  // no teu projeto, params vem como Promise — mantive assim
  params: Promise<{ companyId: string }>;
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function CompanyEmpresaPage({ params }: PageProps) {
  const [{ companyId }, [me, role]] = await Promise.all([
    params,
    Promise.all([getCurrentUser(), getUserRole()]),
  ]);

  return (
    <div className="w-full max-w-screen-lg mx-auto px-3 sm:px-4 md:px-6 py-4 overflow-x-hidden">
      <CompanieCard
        role={role}
        companyId={companyId}
        autoOpen
        viewerCompanyId={me?.companyId}
      />
    </div>
  );
}
