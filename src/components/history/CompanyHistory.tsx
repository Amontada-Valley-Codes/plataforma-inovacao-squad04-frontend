/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React from "react";
import {
  Calendar,
  MoreHorizontal,
  Eye,
  EyeOff,
  Archive,
} from "lucide-react";
import { ChallengeService } from "@/api/services/challenge.service";
import { ShowAllChallengeResponse } from "@/api/payloads/challenge.payload";
import { shortDateFormatter } from "../kanban/Kanban";

type Role = "admin" | "gestor" | "avaliador" | "usuario" | "startup";

type Status = "APPROVE" | "DISAPPROVE" | string;

type Challenge = ShowAllChallengeResponse;

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
}: Props) {
  const [items, setItems] = React.useState<Challenge[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);

      try {
        let data: any[] = [];

        if (role === "usuario") {
          data = await ChallengeService.myHistory();
        } else {
          const params: Record<string, string> = {};

          if (role === "admin" && companyId) {
            params.enterpriseId = companyId;
          }

          if ((role === "gestor" || role === "avaliador") && viewerCompanyId) {
            params.enterpriseId = viewerCompanyId;
          }

          data = await ChallengeService.showHistorical(params);
        }

        const historicalOnly = (data ?? []).filter((c: any) => {
          const s = String(c.status ?? "").toUpperCase();
          return s === "APPROVE" || s === "DISAPPROVE";
        });

        let scoped = historicalOnly;

        if ((role === "gestor" || role === "avaliador") && viewerCompanyId) {
          scoped = scoped.filter(
            (c) => String(c.enterpriseId) === String(viewerCompanyId)
          );
        }

        if (role === "admin" && companyId) {
          scoped = scoped.filter(
            (c) => String(c.enterpriseId) === String(companyId)
          );
        }

        setItems(scoped);
      } catch (e: any) {
        console.error(e);
        setError(e?.message ?? "Erro ao carregar histórico.");
      } finally {
        setLoading(false);
      }
    })();
  }, [companyId, role, viewerCompanyId]);

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "APPROVE":
        return "bg-emerald-500";
      case "DISAPPROVE":
        return "bg-red-500";
      default:
        return "bg-slate-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "APPROVE":
        return "Aprovado";
      case "DISAPPROVE":
        return "Recusado";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="w-full p-6 text-sm text-gray-500">
        Carregando histórico...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="w-full p-6 text-sm text-gray-500">
        Ainda não há desafios aprovados ou recusados.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full p-2">
      {items.map((challenge) => {
        const title = challenge.name;
        const status = challenge.status;
        const isPublic = challenge.visibility === "PUBLIC";
        const when =
          challenge.updatedAt ??
          challenge.createdAt ??
          undefined;

        return (
          <div
            key={challenge.id}
            className="border border-gray-200 dark:border-gray-800 dark:bg-gray-900 bg-white rounded-xl p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-300">
                {title}
              </h2>
            </div>

            {/* Status + Data */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                <span
                  className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}
                />
                {getStatusLabel(status)}
              </div>

              {when && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                  <Calendar size={16} />
                  {shortDateFormatter.format(new Date(when))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-gray-600 dark:text-gray-300">
                {isPublic ? (
                  <span className="inline-flex items-center gap-1 text-sm">
                    <Eye size={18} /> Público
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-sm">
                    <EyeOff size={18} /> Privado
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
