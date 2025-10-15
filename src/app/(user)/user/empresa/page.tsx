import CompanieCard from "@/components/companies/CompanieCard";
import { getCurrentUser, getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UserEmpresaPage() {
  const [me, role] = await Promise.all([getCurrentUser(), getUserRole()]);

  if (role !== "usuario") {
    redirect("/");
  }

  return (
    <div className="w-full max-w-screen-lg mx-auto px-3 sm:px-4 md:px-6 py-4 overflow-x-hidden">
      <CompanieCard
        role={role}
        companyId={String(me.companyId)}
        autoOpen
        viewerCompanyId={me.companyId}
      />
    </div>
  );
}
