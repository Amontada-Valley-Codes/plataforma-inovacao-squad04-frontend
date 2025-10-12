import CompanieCard from "@/components/companies/CompanieCard";
import { getCurrentUser, getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UserEmpresaPage() {
  const [me, role] = await Promise.all([getCurrentUser(), getUserRole()]);

  if (role !== "usuario") {
    redirect("/");
  }

  // Passa role e viewerCompanyId (id da empresa do usuário logado)
  return (
    <CompanieCard
      role={role}
      companyId={String(me.companyId)}
      autoOpen
      viewerCompanyId={me.companyId}
    />
  );
}
