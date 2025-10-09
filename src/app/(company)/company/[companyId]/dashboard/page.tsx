import type { Metadata } from "next";
import React from "react";

import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import ChallengeCard from "@/components/challenge/ChallengeCard";
import { getUserRole } from "@/lib/auth";

// Next 15: params é Promise
type PageProps = { params: Promise<{ companyId: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { companyId } = await params;
  const companyName = `Empresa ${companyId}`;
  return {
    title: `${companyName} • Dashboard`,
    description: `Painel da ${companyName} no Ninna Hub`,
  };
}

export default async function CompanyDashboardPage({ params }: PageProps) {
  const { companyId } = await params;
  const id = Number(companyId);              // ✅ garante número
  const role = await getUserRole();

  if (role === "avaliador") {
    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Empresa / <span className="font-medium">{id}</span> /{" "}
          <span className="font-semibold">Desafios</span>
        </div>

        <ChallengeCard companyId={id} isAdminView /> {/* ✅ passa número */}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Empresa / <span className="font-medium">{id}</span> /{" "}
        <span className="font-semibold">Dashboard</span>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />
          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}
