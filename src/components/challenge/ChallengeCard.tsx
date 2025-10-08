"use client";

import React from "react";
import { Tag, Calendar, Eye, EyeOff, MoreHorizontal } from "lucide-react";
import { challengesData } from "@/mocks/ChallengeData";
import { getCurrentUser } from "@/lib/auth";

type Props = {
  companyId?: number;          // agora number
  isAdminView?: boolean;
  onlyMine?: boolean;
  authorName?: string;         // opcional (override)
};

type Challenge = {
  id: number;
  ChallengeTitle: string;
  Author: string;
  Category: string;
  Status: "Completed" | "In Progress" | "Pending" | string;
  Date: string;
  Visibility: "Public" | "Private" | string;
  companyId?: number;
};

export default function ChallengeCard({
  companyId,
  isAdminView = false,
  onlyMine = false,
  authorName,
}: Props) {
  const data: Challenge[] = challengesData as Challenge[];

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

  const [filtered, setFiltered] = React.useState<Challenge[]>([]);

  React.useEffect(() => {
    const run = async () => {
      let base = data;

      // Filtra por empresa se vier companyId
      if (typeof companyId === "number") {
        base = base.filter((c) => c.companyId === companyId);
      }

      if (isAdminView) {
        // Admin/gestor: vê tudo da empresa (público e privado)
        setFiltered(base);
        return;
      }

      if (onlyMine) {
        // Usuário comum: vê APENAS o que é dele (público/privado), e dentro da empresa se companyId foi informado
        const me = await getCurrentUser();
        const nameToUse = authorName ?? me.name;
        const companyToUse = typeof companyId === "number" ? companyId : me.empresaId;

        const mine = base.filter((c) => {
          const isMine = c.Author === nameToUse;
          const inCompany =
            typeof companyToUse === "number" ? c.companyId === companyToUse : true;
          return isMine && inCompany;
        });

        setFiltered(mine);
        return;
      }

      // Fallback: apenas públicos (e da empresa se informada)
      setFiltered(base.filter((c) => c.Visibility === "Public"));
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, isAdminView, onlyMine, authorName]);

  if (!filtered.length) {
    return (
      <div className="w-full p-6 text-sm text-gray-500 dark:text-[#ced3db]">
        Ainda não submeteste nenhum desafio.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full p-4">
      {filtered.map((challenge) => (
        <div
          key={challenge.id}
          className="border border-gray-200 dark:border-gray-800 dark:bg-gray-900 bg-white rounded-xl p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform"
        >
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

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-sm">
              <Tag size={16} /> {challenge.Category}
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-sm">
              <span className={`w-3 h-3 rounded-full ${getStatusColor(challenge.Status)}`} />
              {challenge.Status}
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-sm">
              <Calendar size={16} /> {challenge.Date}
            </div>
          </div>

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
