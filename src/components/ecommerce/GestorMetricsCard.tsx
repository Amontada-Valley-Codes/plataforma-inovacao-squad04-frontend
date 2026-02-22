"use client";
import React, { useEffect, useState } from "react";
import { gestorDasboardResponse } from "@/api/payloads/dashboard.payload";
import { dashboardService } from "@/api/services/dashboard.service";
import { Box, LayoutDashboard } from "lucide-react";

type Metric = {
  title: string;
  value: number | null;
  icon: React.ReactNode;
};

const MetricItem = ({ title, value, icon }: Metric) => (
  <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/[0.03] flex flex-col items-center text-center">
    <div className="flex items-center justify-center w-10 h-10 bg-[#15409c]/10 rounded-lg dark:bg-[#15409c]/20">
      {icon}
    </div>
    <span className="mt-2 text-lg text-gray-500 dark:text-gray-400">{title}</span>
    <h4 className="mt-1 font-bold text-gray-800 text-3xl dark:text-white/90">{value}</h4>
  </div>
);

export const GestorMetricsCards = () => {

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<gestorDasboardResponse | null>(null);

  async function fetchDashboard() {
    try {
      setLoading(true); 
      const data = await dashboardService.getGestorDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); 
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return 
  }

  const metrics: Metric[] = [
  { title: "Desafios cadastrados", value: dashboardData?.totalDesafios || 0, icon: <LayoutDashboard className="text-[#15409c] w-6 h-6 dark:text-[#15409c]" /> },
  { title: "Total de Pocs", value: dashboardData?.totalPocs || 0, icon: <Box className="text-[#15409c] w-6 h-6 dark:text-[#15409c]" /> },
  { title: "Total de Ideias submetidas", value: dashboardData?.totalIdeas || 0, icon: <Box className="text-[#15409c] w-6 h-6 dark:text-[#15409c]" /> },
  { title: "Usuários Ativos", value: dashboardData?.totalUsers || 0, icon: <Box className="text-[#15409c] w-6 h-6 dark:text-[#15409c]" /> },
];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <MetricItem key={index} {...metric} />
      ))}
    </div>
  );
};
