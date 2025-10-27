// src/app/(admin)/admin/history/page.tsx
"use client";

import React from "react";
import CompanyHistory from "@/components/history/CompanyHistory";
import { getUserRole, getCurrentUser } from "@/lib/auth";

export default function AdminHistoryPage() {
  const [role, setRole] = React.useState<"admin" | "gestor" | "avaliador" | "usuario">("usuario");
  const [viewerUserId, setViewerUserId] = React.useState<string | undefined>(undefined); 
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const r = await getUserRole();
      const u = await getCurrentUser();
      setRole(r);
      setViewerUserId(u?.id != null ? String(u.id) : undefined); // <- converte para string
      setLoaded(true);
    })();
  }, []);

  if (!loaded) return <div className="w-full p-6 text-sm text-gray-500">Carregando desafios...</div>;

  return (
    <div className="space-y-4 px-3 sm:px-4 md:px-6 lg:px-8 py-4">
      <div className="text-xs sm:text-sm text-muted-foreground flex flex-wrap gap-1">
        <span>Admin /</span>
        <span className="font-semibold truncate">Histórico</span>
      </div>

      <div className="w-full overflow-x-auto">
        <CompanyHistory role={role} viewerUserId={viewerUserId} />
      </div>
    </div>
  );
}
