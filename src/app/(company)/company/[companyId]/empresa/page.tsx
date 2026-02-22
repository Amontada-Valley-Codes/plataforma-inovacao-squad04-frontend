
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CompaniesProfileInline from "@/components/companies/CompaniesProfileInline";
import { getCurrentUser } from "@/lib/auth";
import { enterpriseService } from "@/api/services/enterprise.service";
import type {
  ShowAllEnterpriseResponse,
  ShowOneEnterpriseResponse,
} from "@/api/payloads/enterprise.payload";

type Enterprise = ShowAllEnterpriseResponse | ShowOneEnterpriseResponse;

export default function CompanyEmpresaPage() {
  const { companyId } = useParams<{ companyId: string }>();

  const [user, setUser] = useState(getCurrentUser);
  useEffect(() => { setUser(getCurrentUser()); }, []);

  const role = user?.role ?? null;
  const isAdmin = role === "ADMINISTRATOR";
  const isManager = role === "MANAGER";
  const viewerCompanyId = user?.enterpriseId ?? undefined;

  const [enterprise, setEnterprise] = useState<Enterprise | null>(null);
  const [loadingEnterprise, setLoadingEnterprise] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (isAdmin) return;

    const idToFetch =
      companyId != null ? String(companyId)
      : viewerCompanyId != null ? String(viewerCompanyId)
      : undefined;

    if (!idToFetch) {
      setEnterprise(null);
      return;
    }

    let mounted = true;
    setLoadingEnterprise(true);
    enterpriseService
      .showOneEnterprise(idToFetch)
      .then((one) => { if (mounted) setEnterprise(one); })
      .catch(() => { if (mounted) setEnterprise(null); })
      .finally(() => { if (mounted) setLoadingEnterprise(false); });

    return () => { mounted = false; };
  }, [user, companyId, viewerCompanyId, isAdmin]);

  if (!isAdmin && enterprise) {
    return (
      <div className="w-full max-w-screen-xl mx-auto px-3 sm:px-4 md:px-6 py-4 overflow-x-hidden">
        <CompaniesProfileInline />
      </div>
    );
  }

  return null;
}