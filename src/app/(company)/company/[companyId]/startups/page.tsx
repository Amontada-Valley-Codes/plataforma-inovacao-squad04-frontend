import StartupCard from "@/components/startup/StartupCard";
import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";

type PageProps = { params: Promise<{ companyId: string }> };

export default async function CompanyStartupsPage({ params }: PageProps) {
  const { companyId } = await params;
  const role = await getUserRole();

  // ❌ Avaliador e Usuário não têm acesso
  if (role !== "admin" && role !== "gestor") {
    redirect(`/company/${companyId}/desafios`);
  }

  // ✅ Admin/Gestor podem ver
  return (
    <div>
      <StartupCard role={role} />
    </div>
  );
}
