"use client";
import React, { useEffect, useState } from "react";
import { BoxIconLine, GroupIcon } from "@/icons";
import { gestorDasboardResponse } from "@/api/payloads/dashboard.payload";
import { dashboardService } from "@/api/services/dashboard.service";

type Metric = {
  title: string;
  value: number | null;
  icon: React.ReactNode;
};

const MetricItem = ({ title, value, icon }: Metric) => (
  <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/[0.03] flex flex-col items-center text-center">
    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-800">
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
    return (
      <div className="w-full p-6 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-[#15358D]/30 border-t-[#15358D] rounded-full animate-spin"></div>
      </div>
    );
  }

  const metrics: Metric[] = [
  { title: "Desafios cadastrados", value: dashboardData?.totalDesafios || 0, icon: <GroupIcon className="text-gray-800 w-6 h-6 dark:text-white/90" /> },
  { title: "Total de Pocs", value: dashboardData?.totalPocs || 0, icon: <BoxIconLine className="text-gray-800 w-6 h-6 dark:text-white/90" /> },
  { title: "Total de Ideias submetidas", value: dashboardData?.totalIdeas || 0, icon: <BoxIconLine className="text-gray-800 w-6 h-6 dark:text-white/90" /> },
  { title: "Usuários Ativos", value: dashboardData?.totalUsers || 0, icon: <BoxIconLine className="text-gray-800 w-6 h-6 dark:text-white/90" /> },
];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <MetricItem key={index} {...metric} />
      ))}
    </div>
  );
};
