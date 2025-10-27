import type { Metadata } from "next";
import React from "react";

import { getUserRole } from "@/lib/auth";
import ChallengeCard from "@/components/challenge/ChallengeCard";
import { GestorMetricsCards } from "@/components/ecommerce/GestorMetricsCard";

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

  if (role === "avaliador") {
    return (
      <div className="space-y-4 px-3 sm:px-4 md:px-6 lg:px-8 py-4 w-full max-w-screen-xl mx-auto overflow-x-hidden">
        <div className="text-xs sm:text-sm text-muted-foreground flex flex-wrap gap-1">
          <span>Empresa /</span>
          <span className="font-medium break-all">{id}</span> /
          <span className="font-semibold">Desafios</span>
        </div>
        <div className="w-full">
          <ChallengeCard companyId={id} isAdminView />
        </div>
      </div>
    );
  }


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-4 sm:gap-5 md:gap-6 p-3 sm:p-4 md:p-6 w-full max-w-screen-2xl mx-auto overflow-x-hidden">
      <div className="col-span-1 sm:col-span-2 xl:col-span-12">
        <GestorMetricsCards />
      </div>
    </div>
  );
}
