import type { Metadata } from "next";
import React from "react";
import { getUserRole, getCurrentUser } from "@/lib/auth";
import CompanyHistory from "@/components/history/CompanyHistory";

/**
 * Histórico geral do Admin
 * Exibe desafios ativos (não concluídos) de todas as empresas.
 * Admin pode ver todos; avaliadores e gestores veem filtrados.
 */

export const metadata: Metadata = {
  title: "Histórico Geral • Admin",
  description: "Desafios ativos e em andamento de todas as empresas",
};

export default async function AdminHistoryPage() {
  const role = await getUserRole();
  const viewer = await getCurrentUser();
  const viewerUserId = viewer?.id as number | undefined;

  return (
    <div className="space-y-4 px-3 sm:px-4 md:px-6 lg:px-8 py-4">
      {/* Breadcrumb */}
      <div className="text-xs sm:text-sm text-muted-foreground flex flex-wrap gap-1">
        <span>Admin /</span>
        <span className="font-semibold truncate">Histórico</span>
      </div>

      {/* Conteúdo */}
      <div className="w-full overflow-x-auto">
        <CompanyHistory
          role={role}
          viewerUserId={viewerUserId}
          // para admin não precisa de companyId nem viewerCompanyId
        />
      </div>
    </div>
  );
}
