/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React from "react";
import { Tag, Calendar, MoreHorizontal, Eye, EyeOff, Archive } from "lucide-react";
import { ChallengeService } from "@/api/services/challenge.service";
import { ShowAllChallengeResponse } from "@/api/payloads/challenge.payload";
import { getCategoryLabel, shortDateFormatter } from "../kanban/Kanban";

type Role = "admin" | "gestor" | "avaliador" | "usuario" | "startup";

// Ajuste aqui conforme seu payload real:
type Status = "APPROVE" | "DISAPPROVE" | "In Progress" | "Pending" | string;
type Visibility = "Public" | "Private" | string;

type Challenge = ShowAllChallengeResponse

type Props = {
  companyId?: string; 
  role: Role;
  viewerCompanyId?: string;
  viewerUserId?: string;
};

export default function CompanyHistoryHistoric({
  companyId,
  role,
  viewerCompanyId,
  viewerUserId,
}: Props) {
  const [items, setItems] = React.useState<Challenge[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const normalize = (c: Challenge): Challenge => ({
    id: String(c.id),
    name: c.name,
    Users: { 
      name: c.Users?.name ?? "Autor Desconhecido", 
      image: c.Users?.image ?? null
    },
    area: c.area,
    business_relevance: c.business_relevance,
    createdAt: c.createdAt,
    description: c.description,
    endDate: c.endDate,
    enterpriseId: c.enterpriseId,
    innovative_potential: c.innovative_potential,
    startDate: c.startDate,
    status: c.status,
    strategic_alignment: c.strategic_alignment,
    updatedAt: c.updatedAt,
    usersId: c.usersId,
    visibility: c.visibility,
    enterpriseName: c.enterpriseName
  });

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);

      try {
        let data: any[] = [];

        if (role === "usuario") {
          // ✅ Usuário comum: usa /challenge/historical/myhistory (sem params)
          data = await ChallengeService.myHistory();
        } else {
          // Admin / Gestor / Avaliador: permanece com a rota parametrizada
          const params: Record<string, string> = {};

          if (role === "admin") {
            if (companyId) params.enterpriseId = companyId;
          } else if (role === "gestor" || role === "avaliador") {
            if (!viewerCompanyId) {
              setItems([]);
              setLoading(false);
              return;
            }
            params.enterpriseId = viewerCompanyId;
          }

          // Em cenários onde queira histórico por criador específico (ex.: admin vendo um user),
          // poderia usar params.createdById = viewerUserId; — mantive sem isso.
          data = await ChallengeService.showHistorical(params);
        }

        // Garantia: mantém apenas Completed ou Archived (se o backend já filtrar, isso não atrapalha)
        const historicalOnly = (data ?? []).filter((c: any) => {
          const s = String(c.status ?? c.Status ?? "");
          return s === "APPROVE" || s === "DISAPPROVE";
        });

        // Escopos extras client-side (defensivo)
        let scoped = historicalOnly;

        if (role === "gestor" || role === "avaliador") {
          if (viewerCompanyId) {
            scoped = scoped.filter((c) => String(c.enterpriseId) === String(viewerCompanyId));
          }
        } else if (role === "admin" && companyId) {
          scoped = scoped.filter((c) => String(c.enterpriseId) === String(companyId));
        }
        // Para "usuario" não há filtro extra: o endpoint já limita ao próprio usuário.
        console.log(data)
        setItems(scoped.map(normalize));
      } catch (e: any) {
        console.error(error)
        setError(e?.message ?? "Erro ao carregar histórico.");
      } finally {
        setLoading(false);
      }
    })();
  }, [companyId, role, viewerCompanyId, viewerUserId]);

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "APPROVE":
        return "bg-emerald-500";
      case "DISAPPROVE":
        return "bg-gray-500";
      default:
        return "bg-slate-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "APPROVE":
        return "Aprovado"
      case "DISAPPROVE":
        return "Recusado"
    }
  }

  if (loading) {
    return <div className="w-full p-6 text-sm text-gray-500">Carregando histórico...</div>;
  }

  if (error) {
    return <div className="w-full p-6 text-sm text-red-600">{error}</div>;
  }

  if (!items.length) {
    return (
      <div className="w-full p-6 text-sm text-gray-500">
        Ainda não há desafios arquivados ou concluídos para exibir.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full p-2">
      {items.map((challenge) => {
        const title = challenge.name
        const author = challenge.Users.name
        const category = challenge.area
        const status =challenge.status
        const isPublic = challenge.visibility === "PUBLIC";
        const when = challenge.startDate ?? challenge.updatedAt ?? challenge.createdAt ?? "—";

        return (
          <div
            key={challenge.id}
            className="border border-gray-200 dark:border-gray-800 dark:bg-gray-900 bg-white rounded-xl p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-300">
                  {title}
                </h2>
              </div>
              <button aria-label="Mais opções">
                <MoreHorizontal className="text-gray-400 dark:text-[#ced3db] hover:text-gray-600 cursor-pointer" />
              </button>
            </div>

            {/* Metas */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-sm">
                <Tag size={16} /> {getCategoryLabel(category)}
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-sm">
                <span className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
                {getStatusLabel(status)}
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-sm">
                <Calendar size={16} /> {shortDateFormatter.format(new Date(when))}
              </div>
            </div>

            {/* Rodapé */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-gray-600 dark:text-[#ced3db]">
                {isPublic ? (
                  <span title="Público" className="inline-flex items-center gap-1 text-sm">
                    <Eye size={18} /> Público
                  </span>
                ) : (
                  <span title="Privado" className="inline-flex items-center gap-1 text-sm">
                    <EyeOff size={18} /> Privado
                  </span>
                )}
              </div>

              <div className="text-gray-600 dark:text-[#ced3db] inline-flex items-center gap-1 text-sm">
                <Archive size={18} /> Histórico
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
