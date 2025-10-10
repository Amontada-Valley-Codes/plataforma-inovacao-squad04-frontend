import type { Metadata } from "next";
import React from "react";

import { getUserRole } from "@/lib/auth";
import ChallengeCard from "@/components/challenge/ChallengeCard";
import { MetricsCards } from "@/components/ecommerce/EcommerceMetrics";
import DistributionBySector from "@/components/ecommerce/DistributionBySectorChart";
import ActiveCompaniesCard from "@/components/ecommerce/ActiveCompaniesCard";
import IdeiasPerfomance from "@/components/ecommerce/MonthlySalesChart";
import EvolutionChart from "@/components/ecommerce/StatisticsChart";

type PageProps = { params: Promise<{ companyId: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { companyId } = await params;
  return {
    title: `Empresa ${companyId} • Dashboard`,
    description: `Painel da empresa ${companyId}`,
  };
}

export default async function CompanyDashboardPage({ params }: PageProps) {
  const { companyId } = await params;
  const id = Number(companyId);
  const role = await getUserRole();

  // se for avaliador → exibe desafios
  if (role === "avaliador") {
    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Empresa / <span className="font-medium">{id}</span> /{" "}
          <span className="font-semibold">Desafios</span>
        </div>
        <ChallengeCard companyId={id} isAdminView />
      </div>
    );
  }

  // gestor → dashboard padrão
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <MetricsCards />
      </div>

      <div className="col-span-12 xl:col-span-6">
        <IdeiasPerfomance />
      </div>

      <div className="col-span-12 xl:col-span-6">
        <DistributionBySector />
      </div>

      <div className="col-span-12 xl:col-span-6">
        <EvolutionChart />
      </div>

      <div className="col-span-12 xl:col-span-6">
        <ActiveCompaniesCard />
      </div>
    </div>
  );
}
