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
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Admin / <span className="font-semibold">Histórico</span>
      </div>

      <CompanyHistory
        role={role}
        viewerUserId={viewerUserId}
        // para admin não precisa de companyId nem viewerCompanyId
      />
    </div>
  );
}
