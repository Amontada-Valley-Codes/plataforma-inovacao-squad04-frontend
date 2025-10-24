/* eslint-disable @typescript-eslint/no-explicit-any */

import CompanieCard from "@/components/companies/CompanieCard";
import { getCurrentUser, getUserRole } from "@/lib/auth";

export default async function CompanyEmpresaPage({
  params,
}: {
  params: { companyId: string };
  searchParams?: any;
}) {
  const { companyId } = params;

  const [me, role] = await Promise.all([getCurrentUser(), getUserRole()]);

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
