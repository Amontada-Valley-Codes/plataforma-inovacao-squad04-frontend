import type { Metadata } from "next";
import React from "react";
import { getUserRole, getUserCompanyId, getCurrentUser } from "@/lib/auth";
import CompanyHistory from "@/components/history/CompanyHistory";

type HistoryPageProps = {
  params: Promise<{ companyId: string }>;
};

export async function generateMetadata({ params }: HistoryPageProps): Promise<Metadata> {
  const { companyId } = await params;
  return {
    title: `Empresa ${companyId} • Histórico (Ativos)`,
    description: `Desafios ativos da Empresa ${companyId}`,
  };
}

export default async function HistoryPage({ params }: HistoryPageProps) {
  const { companyId } = await params;

  const role = await getUserRole();
  const viewerCompanyId = await getUserCompanyId();
  const viewer = await getCurrentUser();
  const viewerUserId = viewer?.id as number | undefined;

  return (
    <div className="space-y-4 px-3 sm:px-4 md:px-6 lg:px-8 py-4 w-full max-w-screen-xl mx-auto overflow-x-hidden">
      {/* Breadcrumb */}
      <div className="text-xs sm:text-sm text-muted-foreground flex flex-wrap gap-1">
        <span>Empresa /</span>
        <span className="font-medium break-all">{companyId}</span> /
        <span className="font-semibold">Histórico</span>
      </div>

      {/* Conteúdo principal */}
      <div className="w-full">
        <CompanyHistory
          companyId={Number(companyId)}
          role={role}
          viewerCompanyId={viewerCompanyId}
          viewerUserId={viewerUserId}
        />
      </div>
    </div>
  );
}
