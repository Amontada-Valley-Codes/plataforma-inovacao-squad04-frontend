'use client'

import { MetricsCards } from "@/components/ecommerce/EcommerceMetrics";
import React, { useEffect, useState } from "react";
import DistributionBySector from "@/components/ecommerce/DistributionBySectorChart";
import ActiveCompaniesCard from "@/components/ecommerce/ActiveCompaniesCard";
import IdeiasPerfomance from "@/components/ecommerce/MonthlySalesChart";
import EvolutionChart from "@/components/ecommerce/StatisticsChart";
import { dashboardService } from "@/api/services/dashboard.service";
import { adminDasboardResponse } from "@/api/payloads/dashboard.payload";

export default function Ecommerce() {
  const [dashboardData, setDashboardData] = useState<adminDasboardResponse | null>(null);
  const [loading, setLoading] = useState(false);

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
        <IdeiasPerfomance desempenhoMensal={dashboardData?.desempenhoMensal ?? {}} />
      </div>

      {/* Sector Distribution */}
      <div className="col-span-1 sm:col-span-2 xl:col-span-6">
        <DistributionBySector distribuicaoPorSetor={dashboardData?.distribuicaoPorSetor ?? {}} />
      </div>

      {/* Participation Evolution */}
      <div className="col-span-1 sm:col-span-2 xl:col-span-6">
        <EvolutionChart />
      </div>

      {/* Monthly Target */}
      <div className="col-span-1 sm:col-span-2 xl:col-span-6">
        <ActiveCompaniesCard rankingEmpresas={dashboardData?.rankingEmpresas ?? []} />
      </div>
    </div>
  );
}
