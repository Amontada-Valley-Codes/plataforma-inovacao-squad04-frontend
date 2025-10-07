"use client";

import { Tag, Calendar, Eye, EyeOff, MoreHorizontal } from "lucide-react";
import { challengesData } from "@/mocks/ChallengeData";

// Props que o card aceita
type Props = {
  /** companyId da rota (string) para filtrar os desafios da empresa */
  companyId?: string;
  /** se true, mostra privados da própria empresa (visão admin/gestor da empresa) */
  isAdminView?: boolean;
};

// Tipo local usado pelo componente (companyId como string)
type Challenge = {
  ChallengeTitle: string;
  Author: string;
  Category: string;
  Status: "Completed" | "In Progress" | "Pending" | string;
  Date: string;
  Visibility: "Public" | "Private";
  companyId: string;
};

export default function ChallengeCard({ companyId, isAdminView = false }: Props) {
  // Normaliza o mock para o tipo local (companyId => string) sem alterar o mock
  const data: Challenge[] = (challengesData as any[]).map((c) => ({
    ...c,
    companyId: String(c?.companyId ?? ""),
  }));

  // Regras de filtro por empresa + visibilidade
  const filtered = companyId
    ? data.filter((c) => {
        const isSameCompany = c.companyId === companyId;
        if (!isSameCompany) return false;
        if (c.Visibility === "Public") return true;
        return isAdminView; // privados só aparecem se for visão admin/gestor
      })
    : data; // se não vier companyId, mostra tudo (fallback)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-400";
      case "In Progress":
        return "bg-yellow-400";
      case "Pending":
        return "bg-red-400";
      default:
        return "bg-gray-400";
    }
  };

  if (!filtered.length) {
    return (
      <div className="w-full p-6 text-sm text-gray-500 dark:text-[#ced3db]">
        Nenhum desafio encontrado para esta empresa.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full p-4">
      {filtered.map((challenge, index) => (
        <div
          key={index}
          className="border border-gray-200 dark:border-gray-800 dark:bg-gray-900 bg-white rounded-xl p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-300">
                {challenge.ChallengeTitle}
              </h2>
              <p className="text-gray-500 dark:text-[#ced3db] text-sm">
                {challenge.Author}
              </p>
            </div>

            <button aria-label="Mais opções">
              <MoreHorizontal className="text-gray-400 dark:text-[#ced3db] hover:text-gray-600 cursor-pointer" />
            </button>
          </div>

          {/* Info */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-sm">
              <Tag size={16} /> {challenge.Category}
            </div>

            <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-sm">
              <span
                className={`w-3 h-3 rounded-full ${getStatusColor(challenge.Status)}`}
              />
              {challenge.Status}
            </div>

            <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-sm">
              <Calendar size={16} /> {challenge.Date}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-4 text-gray-600 dark:text-[#ced3db]">
            {challenge.Visibility === "Public" ? (
              <span title="Público">
                <Eye size={18} />
              </span>
            ) : (
              <span title="Privado">
                <EyeOff size={18} />
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
