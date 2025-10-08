// app/(admin)/admin/companies/page.tsx
import CompanieCard from "@/components/companies/CompanieCard";
import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminCompaniesPage() {
  const role = await getUserRole();
  if (role !== "admin") redirect("/");

  return <CompanieCard />;
}
