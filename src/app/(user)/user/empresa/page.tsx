import CompanieCard from "@/components/companies/CompanieCard";
import { getCurrentUser, getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation"; // ✅ adiciona isso

export default async function UserEmpresaPage() {
    const [me, role] = await Promise.all([getCurrentUser(), getUserRole()]);

    if (role !== "usuario") {
        redirect("/");
    }

    return <CompanieCard companyId={String(me.companyId)} autoOpen />;
}
