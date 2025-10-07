// src/app/(company)/company/[companyId]/dashboard/page.tsx
import type { Metadata } from "next";
import React from "react";

import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";

// 👇 note que params agora é Promise<...>
type PageProps = { params: Promise<{ companyId: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { companyId } = await params; // ✅ aguarde antes de usar
    const companyName = `Empresa ${companyId}`;
    return {
        title: `${companyName} • Dashboard`,
        description: `Painel da ${companyName} no Ninna Hub`,
    };
}

export default async function CompanyDashboardPage({ params }: PageProps) {
    const { companyId } = await params; // ✅ aguarde antes de usar

    return (
        <div className="space-y-4">
            {/* breadcrumb opcional */}
            <div className="text-sm text-muted-foreground">
                Company / <span className="font-medium">{companyId}</span> / <span className="font-semibold">Dashboard</span>
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
