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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-4 sm:gap-5 md:gap-6 p-3 sm:p-4 md:p-6">
      {/* Metrics Cards */}
      <div className="col-span-1 sm:col-span-2 xl:col-span-12">
        <MetricsCards />
      </div>

      {/* Ideias Performance */}
      <div className="col-span-1 sm:col-span-2 xl:col-span-6">
        <IdeiasPerfomance />
      </div>

      {/* Sector Distribution */}
      <div className="col-span-1 sm:col-span-2 xl:col-span-6">
        <DistributionBySector />
      </div>

      {/* Participation Evolution */}
      <div className="col-span-1 sm:col-span-2 xl:col-span-6">
        <EvolutionChart />
      </div>

      {/* Monthly Target */}
      <div className="col-span-1 sm:col-span-2 xl:col-span-6">
        <ActiveCompaniesCard />
      </div>
    </div>
  );
}
