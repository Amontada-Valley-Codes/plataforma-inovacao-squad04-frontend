"use client";
import React from "react";
import { BoxIconLine, GroupIcon } from "@/icons";

type Metric = {
  title: string;
  value: number;
  icon: React.ReactNode;
};

const metrics: Metric[] = [
  { title: "Empresas cadastradas", value: 124, icon: <GroupIcon className="text-gray-800 w-6 h-6 dark:text-white/90" /> },
  { title: "Desafios", value: 58, icon: <BoxIconLine className="text-gray-800 w-6 h-6 dark:text-white/90" /> },
  { title: "Ideias submetidas", value: 842, icon: <BoxIconLine className="text-gray-800 w-6 h-6 dark:text-white/90" /> },
  { title: "Empresas Ativas", value: 37, icon: <BoxIconLine className="text-gray-800 w-6 h-6 dark:text-white/90" /> },
];

const MetricItem = ({ title, value, icon }: Metric) => (
  <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/[0.03] flex flex-col items-center text-center">
    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-800">
      {icon}
    </div>
    <span className="mt-2 text-lg text-gray-500 dark:text-gray-400">{title}</span>
    <h4 className="mt-1 font-bold text-gray-800 text-3xl dark:text-white/90">{value}</h4>
  </div>
);

export const MetricsCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <MetricItem key={index} {...metric} />
      ))}
    </div>
  );
};
