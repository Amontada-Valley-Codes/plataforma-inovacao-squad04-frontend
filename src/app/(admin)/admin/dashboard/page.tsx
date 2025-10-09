import type { Metadata } from "next";
import { MetricsCards } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import DistributionBySector from "@/components/ecommerce/DistributionBySectorChart";
import ActiveCompaniesCard from "@/components/ecommerce/ActiveCompaniesCard";
import IdeiasPerfomance from "@/components/ecommerce/MonthlySalesChart";
import EvolutionChart from "@/components/ecommerce/StatisticsChart";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">

      {/* Metrics Cards */}
      <div className="col-span-12">
        <MetricsCards />
      </div>

      {/* Ideias perfomance */}
      <div className="col-span-12 xl:col-span-6">
        <IdeiasPerfomance />
      </div>
      
      {/* Sector Distribuition */}
      <div className="col-span-12 xl:col-span-6">
        <DistributionBySector />
      </div>

       {/* Participation Evoluiton */}
       <div className="col-span-12 xl:col-span-6">
        <EvolutionChart />
      </div>
      
      {/* Monthly Target */}
      <div className="col-span-12 xl:col-span-6">
        <ActiveCompaniesCard />
      </div>




    </div>
  );
}
