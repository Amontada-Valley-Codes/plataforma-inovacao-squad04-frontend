// src/app/(company)/company/[companyId]/history/page.tsx
"use client";

import { getUserRole, getCurrentUser, getUserCompanyId } from "@/lib/auth";
import CompanyHistoryHistoric from "@/components/history/CompanyHistory";
import { use, useEffect, useState } from "react";
import { ShowOneEnterpriseResponse } from "@/api/payloads/enterprise.payload";
import { enterpriseService } from "@/api/services/enterprise.service";

type PageProps = {
  params: Promise<{ companyId: string }>;
};

export default function CompanyHistoryPage({ params }: PageProps) {
  const { companyId } = use(params);

  const [role, setRole] = useState<"startup" | "admin" | "gestor" | "avaliador" | "usuario">("usuario");
  const [viewerCompanyId, setViewerCompanyId] = useState<string | undefined>();
  const [viewerUserId, setViewerUserId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [enterpriseName, setEnterpriseName] = useState<ShowOneEnterpriseResponse["name"]>()

  const fetchEnterprise = async () => {
    try {
      const response = await enterpriseService.getMyEnterprise()
      setEnterpriseName(response?.name)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchEnterprise()
  }, [])

  useEffect(() => {
    (async () => {
      const r = await getUserRole();
      const u = await getCurrentUser();
      const c = await getUserCompanyId();

      setRole(r);
      setViewerCompanyId(c ? String(c) : undefined);
      setViewerUserId(u?.id ? String(u.id) : undefined);
      setLoading(false); // ✅ corrigido: false quando termina de carregar
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground dark:text-gray-400">Carregando</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-3 sm:px-4 md:px-6 lg:px-8 py-4">
      <div className="text-xs sm:text-sm text-muted-foreground flex flex-wrap gap-1">
        <span>Empresa /</span>
        <span className="font-semibold truncate">{enterpriseName}</span>
        <span>/ Histórico</span>
      </div>

      <div className="w-full overflow-x-auto">
        <CompanyHistoryHistoric
          companyId={companyId}
          role={role}
          viewerCompanyId={viewerCompanyId}
          viewerUserId={viewerUserId}
        />
      </div>
    </div>
  );
}