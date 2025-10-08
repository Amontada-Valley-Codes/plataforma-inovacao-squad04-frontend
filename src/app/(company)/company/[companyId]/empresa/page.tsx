// app/(company)/company/[companyId]/empresa/page.tsx
import CompanieCard from "@/components/companies/CompanieCard";
import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";

type PageProps = { params: Promise<{ companyId: string }> };

export default async function CompanyEmpresaPage({ params }: PageProps) {
    const { companyId } = await params;
    const role = await getUserRole();


    // Filtra pela empresa e abre diretamente o perfil (sem lista)
    return <CompanieCard companyId={companyId} autoOpen />;
}
