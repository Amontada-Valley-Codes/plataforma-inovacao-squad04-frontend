"use client";

import { useEffect, useState } from 'react';
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { ChallengeService } from '@/api/services/challenge.service';
import { ChallengesByStageResponse } from '@/api/payloads/challenge.payload';

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const STAGE_ORDER = ['GENERATION', 'PRE_SCREENING', 'DETAILED_SCREENING', 'MATERIALIZATION', 'EXPERIMENTATION', 'SCALE'];

const STAGE_LABELS: Record<string, string> = {
  GENERATION: 'Geração',
  PRE_SCREENING: 'Pré-Triagem',
  DETAILED_SCREENING: 'Triagem Detalhada',
  MATERIALIZATION: 'Materialização',
  EXPERIMENTATION: 'Experimentação',
  SCALE: 'Escala',
};

const STAGE_COLORS: Record<string, string> = {
  GENERATION: '#15409c',      
  PRE_SCREENING: '#15409c',
  DETAILED_SCREENING: '#15409c', 
  MATERIALIZATION: '#15409c', 
  EXPERIMENTATION: '#15409c',
  SCALE: '#15409c',
};

export default function ChallengesByStageChart() {
  const [data, setData] = useState<ChallengesByStageResponse>([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ChallengeService.getChallengesByStage();
        setData(response);
      } catch (err) {
        console.error('Erro ao buscar desafios por etapa:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-[280px]">
  //       <span className="text-muted-foreground dark:text-gray-400">Carregando...</span>
  //     </div>
  //   );
  // }

  // Cria um mapa com os dados da API
  const dataMap = new Map(data.map(item => [item.stage, item.total]));

  // Garante que todas as etapas apareçam na ordem correta
  const categories = STAGE_ORDER.map(stage => STAGE_LABELS[stage]);
  const seriesData = STAGE_ORDER.map(stage => dataMap.get(stage) || 0);
  const colors = STAGE_ORDER.map(stage => STAGE_COLORS[stage]);

  const options: ApexOptions = {
    colors,
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 280,
      toolbar: {
        show: false,
      },
      background: 'transparent',
    },
    theme: {
      mode: isDark ? 'dark' : 'light',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 8,
        borderRadiusApplication: "end",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: isDark ? '#9ca3af' : '#6b7280',
        },
      },
    },
    yaxis: {
      title: {
        text: undefined,
      },
      labels: {
        style: {
          colors: isDark ? '#9ca3af' : '#6b7280',
        },
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
      borderColor: isDark ? '#374151' : '#e5e7eb',
    },
    fill: {
      opacity: 1,
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      y: {
        formatter: (val: number) => `${val} desafios`,
      },
    },
  };

  const series = [
    {
      name: "Desafios",
      data: seriesData,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-card to-card/80 dark:from-gray-900 dark:to-gray-900/80 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
      <div className="mb-6">
        <h3 className="font-bold text-foreground dark:text-white text-xl font-semibold text-gray-600 dark:text-white/90">
          Desafios por Etapa
        </h3>
        <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
          Distribuição de desafios ativos em cada fase do funil de inovação.
        </p>
      </div>
      <div className="max-w-full overflow-x-auto">
        <div id="challengesByStage" className="min-w-[600px]">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={280}
          />
        </div>
      </div>
    </div>
  );
}
