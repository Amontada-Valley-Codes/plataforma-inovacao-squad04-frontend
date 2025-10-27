/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React from "react";
import { Tag, Calendar, MoreHorizontal, Eye, EyeOff, Archive } from "lucide-react";
import { ChallengeService } from "@/api/services/challenge.service";

type Role = "admin" | "gestor" | "avaliador" | "usuario" | "startup";

// Ajuste aqui conforme seu payload real:
type Status = "Completed" | "Archived" | "In Progress" | "Pending" | string;
type Visibility = "Public" | "Private" | string;

type Challenge = {
  id: string;
  name?: string;
  ChallengeTitle?: string;
  authorName?: string;
  Author?: string;
  category?: string;
  Category?: string;
  status: Status;
  Status?: Status;
  createdAt?: string;
  updatedAt?: string;
  Date?: string;
  visibility: Visibility;
  Visibility?: Visibility;
  enterpriseId?: string;
  usersId?: string;
  createdById?: string;
};

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

  const normalize = (c: any): Challenge => ({
    id: String(c.id),
    name: c.name ?? c.ChallengeTitle,
    ChallengeTitle: c.ChallengeTitle ?? c.name,
    authorName: c.authorName ?? c.Author,
    Author: c.Author ?? c.authorName,
    category: c.category ?? c.Category,
    Category: c.Category ?? c.category,
    status: (c.status ?? c.Status) as Status,
    Status: (c.Status ?? c.status) as Status,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    Date: c.Date ?? c.createdAt,
    visibility: (c.visibility ?? c.Visibility) as Visibility,
    Visibility: (c.Visibility ?? c.visibility) as Visibility,
    enterpriseId: c.enterpriseId,
    usersId: c.usersId,
    createdById: c.createdById ?? c.usersId,
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
          return s === "Completed" || s === "Archived";
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

        setItems(scoped.map(normalize));
      } catch (e: any) {
        setError(e?.message ?? "Erro ao carregar histórico.");
      } finally {
        setLoading(false);
      }
    })();
  }, [companyId, role, viewerCompanyId, viewerUserId]);

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500";
      case "Archived":
        return "bg-gray-500";
      default:
        return "bg-slate-400";
    }
  };

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
        const title = challenge.ChallengeTitle ?? challenge.name ?? "Desafio";
        const author = challenge.Author ?? challenge.authorName ?? "—";
        const category = challenge.Category ?? challenge.category ?? "—";
        const status = (challenge.Status ?? challenge.status) as Status;
        const isPublic = (challenge.Visibility ?? challenge.visibility) === "Public";
        const when = challenge.Date ?? challenge.updatedAt ?? challenge.createdAt ?? "—";

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
                <p className="text-gray-500 dark:text-[#ced3db] text-sm">{author}</p>
              </div>
              <button aria-label="Mais opções">
                <MoreHorizontal className="text-gray-400 dark:text-[#ced3db] hover:text-gray-600 cursor-pointer" />
              </button>
            </div>

            {/* Metas */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-sm">
                <Tag size={16} /> {category}
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-sm">
                <span className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
                {status}
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-sm">
                <Calendar size={16} /> {when}
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
