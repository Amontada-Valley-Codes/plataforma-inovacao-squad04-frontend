// app/(company)/company/[companyId]/empresa/page.tsx
import CompanieCard from "@/components/companies/CompanieCard";
import { getCurrentUser, getUserRole } from "@/lib/auth";

type PageProps = {
  // no teu projeto, params vem como Promise — mantive assim
  params: Promise<{ companyId: string }>;
  // pode existir, mas NÃO usamos role daqui pra permissão
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function CompanyEmpresaPage({ params }: PageProps) {
  const [{ companyId }, [me, role]] = await Promise.all([
    params,
    Promise.all([getCurrentUser(), getUserRole()]),
  ]);

  // Passa SEMPRE o role real e o viewerCompanyId (empresa do usuário logado)
  // O CompanieCard já faz:
  //   editable = role === "admin" || (role === "gestor" && viewerCompanyId === companyId)
  return (
    <CompanieCard
      role={role}
      companyId={companyId}
      autoOpen
      viewerCompanyId={me?.companyId}
    />
  );
}
