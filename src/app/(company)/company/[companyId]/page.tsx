// app/(admin)/admin/company/[companyId]/page.tsx (exemplo de caminho)
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserRole } from "@/lib/auth";
import ChallengeCard from "@/components/challenge/ChallengeCard";
import { MetricsCards } from "@/components/ecommerce/EcommerceMetrics";
import DistributionBySector from "@/components/ecommerce/DistributionBySectorChart";
import ActiveCompaniesCard from "@/components/ecommerce/ActiveCompaniesCard";
import IdeiasPerfomance from "@/components/ecommerce/MonthlySalesChart";
import EvolutionChart from "@/components/ecommerce/StatisticsChart";

export default function CompanyDashboardPage() {
  const params = useParams<{ companyId: string }>();
  const companyId = Number(params.companyId);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    getUserRole().then(setRole);
  }, []);

  if (!role) return null; // ou um skeleton

  // avaliador vê desafios
  if (role === "avaliador") {
    return (
      <div className="space-y-4 px-3 sm:px-4 md:px-6 lg:px-8 py-4 w-full max-w-screen-xl mx-auto overflow-x-hidden">
        <div className="text-xs sm:text-sm text-muted-foreground flex flex-wrap gap-1">
          <span>Empresa /</span>
          <span className="font-medium break-all">{companyId}</span> /
          <span className="font-semibold">Desafios</span>
        </div>
        <div className="w-full">
          <ChallengeCard companyId={companyId} isAdminView />
        </div>
      </div>
    );
  }

  // gestor (e admin) veem dashboard padrão
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-4 sm:gap-5 md:gap-6 p-3 sm:p-4 md:p-6 w-full max-w-screen-2xl mx-auto overflow-x-hidden">
      <div className="col-span-1 sm:col-span-2 xl:col-span-12">
        <MetricsCards />
      </div>

      <div className="col-span-1 sm:col-span-2 xl:col-span-6">
        <IdeiasPerfomance />
      </div>

      <div className="col-span-1 sm:col-span-2 xl:col-span-6">
        <DistributionBySector />
      </div>

      <div className="col-span-1 sm:col-span-2 xl:col-span-6">
        <EvolutionChart />
      </div>

      <div className="col-span-1 sm:col-span-2 xl:col-span-6">
        <ActiveCompaniesCard />
      </div>
    </div>
  );
}
