"use client";

import { getCurrentUser } from "@/lib/auth";
import CompanyHistoryHistoric from "@/components/history/CompanyHistory";
import { use, useEffect, useState } from "react";
import { ShowOneEnterpriseResponse } from "@/api/payloads/enterprise.payload";
import { enterpriseService } from "@/api/services/enterprise.service";
import type { Role } from "@/lib/roles";

type PageProps = {
  params: Promise<{ companyId: string }>;
};

export default function CompanyHistoryPage({ params }: PageProps) {
  const { companyId } = use(params);

  const user = getCurrentUser(); 

  const [enterpriseName, setEnterpriseName] = useState<
    ShowOneEnterpriseResponse["name"] | undefined
  >();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    enterpriseService
      .getMyEnterprise()
      .then((res) => setEnterpriseName(res?.name))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
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
          role={user?.role as Role}
          viewerCompanyId={user?.enterpriseId ?? undefined}
          viewerUserId={user?.id}
        />
      </div>
    </div>
  );
}