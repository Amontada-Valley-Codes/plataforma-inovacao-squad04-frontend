"use client";

import React from "react";
import { getUserRole, getUserCompanyId, getCurrentUser } from "@/lib/auth";
import CompanyHistory from "@/components/history/CompanyHistory";

export default function UserHistoryPage() {
  const [role, setRole] = React.useState<"startup" | "usuario" | "admin" | "gestor" | "avaliador">("usuario");
  const [viewerCompanyId, setViewerCompanyId] = React.useState<string | undefined>(undefined);
  const [viewerUserId, setViewerUserId] = React.useState<string | undefined>(undefined);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const r = await getUserRole();
      const c = await getUserCompanyId();
      const u = await getCurrentUser();

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
    <div className="space-y-4 px-3 sm:px-4 md:px-6 lg:px-8 py-4 w-full max-w-screen-xl mx-auto overflow-x-hidden">
      {/* Breadcrumb */}
      <div className="text-xs sm:text-sm text-muted-foreground flex flex-wrap gap-1">
        <span>Utilizador /</span>
        <span className="font-semibold">Histórico</span>
      </div>

      {/* Conteúdo principal */}
      <div className="w-full">
        <CompanyHistory
          role={role}
          viewerCompanyId={viewerCompanyId}
          viewerUserId={viewerUserId}
        />
      </div>
    </div>
  );
}
