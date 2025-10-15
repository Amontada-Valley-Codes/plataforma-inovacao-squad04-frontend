import type { Metadata } from "next";
import React from "react";
import { getUserRole, getUserCompanyId, getCurrentUser } from "@/lib/auth";
import CompanyHistory from "@/components/history/CompanyHistory";

/**
 * Histórico do usuário comum
 * Mostra apenas desafios públicos da empresa do usuário logado.
 * Filtra automaticamente pelo viewerCompanyId e role="usuario".
 */

export const metadata: Metadata = {
  title: "Meu Histórico • Usuário",
  description: "Histórico de desafios ativos e concluídos do usuário logado",
};

export default async function UserHistoryPage() {
  const role = await getUserRole(); // deve retornar "usuario"
  const viewerCompanyId = await getUserCompanyId();
  const viewer = await getCurrentUser();
  const viewerUserId = viewer?.id as number | undefined;

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
