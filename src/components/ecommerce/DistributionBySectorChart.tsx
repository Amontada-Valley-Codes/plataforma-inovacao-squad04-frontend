'use client'

import { MoreDotIcon } from "@/icons";
import ReactApexChart from "react-apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState } from "react";
import { ApexOptions } from "apexcharts";

type DistributionBySectorProps = {
  distribuicaoPorSetor: Record<string, number>;
};

export default function DistributionBySector({ distribuicaoPorSetor }: DistributionBySectorProps) {
  const categories = Object.keys(distribuicaoPorSetor); 
  const data = Object.values(distribuicaoPorSetor); 

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: { horizontal: false, columnWidth: "39%", borderRadius: 5 },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: { categories, axisBorder: { show: false }, axisTicks: { show: false } },
    legend: { show: true, position: "top", horizontalAlign: "left", fontFamily: "Outfit" },
    yaxis: { title: { text: undefined } },
    grid: { yaxis: { lines: { show: true } } },
    fill: { opacity: 1 },
    tooltip: { y: { formatter: (val: number) => `${val}` }, x: { show: false } },
  };

  const series = [{ name: "Total", data }];

  // Dropdown code permanece igual
  const [isOpen, setIsOpen] = useState(false);
  function toggleDropdown() { setIsOpen(!isOpen); }
  function closeDropdown() { setIsOpen(false); }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Distribuição por setor</h3>
        <div className="relative inline-block">
          <button onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
            <DropdownItem onItemClick={closeDropdown} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
              View More
            </DropdownItem>
            <DropdownItem onItemClick={closeDropdown} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
}
