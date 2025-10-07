import type { Metadata } from "next";
import React from "react";

import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";

type PageProps = { params: { companyId: string } };

// (Opcional) se tiveres como resolver o nome da empresa pelo ID, usa aqui
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { companyId } = params;
    const companyName = `Empresa ${companyId}`; // placeholder; depois busca na API
    return {
        title: `${companyName} • Dashboard`,
        description: `Painel da ${companyName} no Ninna Hub`,
    };
}

export default function CompanyDashboardPage({ params }: PageProps) {
    const { companyId } = params;

    // Se quiser exibir um header/breadcrumb simples:
    // (pode mover isso pro AppHeader depois)
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <nav className="text-sm text-muted-foreground">
                        <span>Company</span> <span className="mx-1">/</span>
                        <span className="font-medium text-foreground">{companyId}</span> <span className="mx-1">/</span>
                        <span className="font-semibold">Dashboard</span>
                    </nav>
                    <h1 className="mt-1 text-xl font-semibold">Visão geral</h1>
                </div>
                {/* Placeholder para seletor de empresa / ações */}
                {/* <CompanySwitcher /> */}
            </div>

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-6 xl:col-span-7">
                    {/* No futuro: <EcommerceMetrics companyId={companyId} /> */}
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
