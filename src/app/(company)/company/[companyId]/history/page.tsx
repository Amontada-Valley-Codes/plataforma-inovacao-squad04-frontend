// src/app/(company)/company/[companyId]/history/page.tsx
"use client";

import React from "react";

import { getUserRole, getCurrentUser, getUserCompanyId } from "@/lib/auth";
import CompanyHistoryHistoric from "@/components/history/CompanyHistory";

type PageProps = {
  params: Promise<{ companyId: string }>;
};

export default function CompanyHistoryPage({ params }: PageProps) {
  const { companyId } = React.use(params);

  const [role, setRole] = React.useState<"admin" | "gestor" | "avaliador" | "usuario">("usuario");
  const [viewerCompanyId, setViewerCompanyId] = React.useState<string | undefined>();
  const [viewerUserId, setViewerUserId] = React.useState<string | undefined>();
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const r = await getUserRole();
      const u = await getCurrentUser();
      const c = await getUserCompanyId();

      setRole(r);
      setViewerCompanyId(c ? String(c) : undefined);
      setViewerUserId(u?.id ? String(u.id) : undefined);
      setLoaded(true);
    })();
  }, []);

  if (!loaded) {
    return <div className="w-full p-6 text-sm text-gray-500">Carregando histórico...</div>;
  }

  return (
    <div className="space-y-4 px-3 sm:px-4 md:px-6 lg:px-8 py-4">
      <div className="text-xs sm:text-sm text-muted-foreground flex flex-wrap gap-1">
        <span>Empresa /</span>
        <span className="font-semibold truncate">{companyId}</span>
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
