import AdminCompaniesClient from "@/components/companies/AdminCompaniesCard";

export const dynamic = "force-dynamic";

export default function AdminCompaniesPage() {
  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <AdminCompaniesClient />
    </div>
  );
}
