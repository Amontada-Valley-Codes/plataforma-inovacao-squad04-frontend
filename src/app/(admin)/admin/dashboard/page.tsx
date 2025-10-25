"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { MetricsCards } from "@/components/ecommerce/EcommerceMetrics";
import ActiveCompaniesCard from "@/components/ecommerce/ActiveCompaniesCard";
import { dashboardService } from "@/api/services/dashboard.service";
import { adminDasboardResponse } from "@/api/payloads/dashboard.payload";

// Dynamic imports to disable SSR for charts
const DistributionBySector = dynamic(
  () => import("@/components/ecommerce/DistributionBySectorChart"),
  { ssr: false, loading: () => <p>Carregando gráfico...</p> }
);

const IdeiasPerfomance = dynamic(
  () => import("@/components/ecommerce/MonthlySalesChart"),
  { ssr: false, loading: () => <p>Carregando gráfico...</p> }
);

const EvolutionChart = dynamic(
  () => import("@/components/ecommerce/StatisticsChart"),
  { ssr: false, loading: () => <p>Carregando gráfico...</p> }
);

export default function Ecommerce() {
  const [dashboardData, setDashboardData] = useState<adminDasboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const data = await dashboardService.getAdminDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      setLoading(true); // 👈 LIGAR o loading antes de chamar a API
      const data = await dashboardService.getAdminDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // 👈 DESLIGAR depois
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);
  
  if (loading) {
    return (
      <div className="w-full p-6 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-[#15358D]/30 border-t-[#15358D] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-4 sm:gap-5 md:gap-6 p-3 sm:p-4 md:p-6">
      {/* Metrics Cards */}
      <div className="col-span-1 sm:col-span-2 xl:col-span-12">
        <MetricsCards
          empresasAtivas={dashboardData?.empresasAtivas ?? 0}
          totalDesafios={dashboardData?.totalDesafios ?? 0}
          totalEmpresas={dashboardData?.totalEmpresas ?? 0}
          totalIdeias={dashboardData?.totalIdeias ?? 0}
        />
      </div>

      {/* Ideias Performance */}
      <div className="col-span-1 sm:col-span-2 xl:col-span-6">
        <IdeiasPerfomance
          desempenhoMensal={dashboardData?.desempenhoMensal ?? {}}
        />
      </div>

      {/* Sector Distribution */}
      <div className="col-span-1 sm:col-span-2 xl:col-span-6">
        <DistributionBySector
          distribuicaoPorSetor={dashboardData?.distribuicaoPorSetor ?? {}}
        />
      </div>

      {/* Participation Evolution */}
      <div className="col-span-1 sm:col-span-2 xl:col-span-6">
        <EvolutionChart />
      </div>

      {/* Active Companies Ranking */}
      <div className="col-span-1 sm:col-span-2 xl:col-span-6">
        <ActiveCompaniesCard
          rankingEmpresas={dashboardData?.rankingEmpresas ?? []}
        />
      </div>
    </div>
  );
}
