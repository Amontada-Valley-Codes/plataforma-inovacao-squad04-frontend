"use client";
import React from "react";

type CompanyRanking = {
  name: string;
  ideas: number;
  rank: number;
};

const ranking: CompanyRanking[] = [
  { rank: 1, name: "Empresa X", ideas: 27 },
  { rank: 2, name: "Empresa Y", ideas: 19 },
  { rank: 3, name: "Empresa Z", ideas: 15 },
];

const getMedalColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-yellow-400 text-white";
    case 2:
      return "bg-gray-300 text-gray-800";
    case 3:
      return "bg-orange-400 text-white";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

export default function ActiveCompaniesCard() {
  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-4 sm:p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
        Ranking Empresas Mais Ativas
      </h3>

      <ul className="space-y-3">
        {ranking.map((company) => (
          <li
            key={company.rank}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0"
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full font-semibold text-sm sm:text-base ${getMedalColor(
                  company.rank
                )}`}
              >
                {company.rank}
              </span>
              <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium truncate max-w-[120px] sm:max-w-xs md:max-w-sm">
                {company.name}
              </span>
            </div>
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {company.ideas} ideias
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
