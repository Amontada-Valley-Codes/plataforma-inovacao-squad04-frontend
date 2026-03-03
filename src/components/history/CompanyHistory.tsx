"use client";

import React from "react";
import { Calendar, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { ChallengeService } from "@/api/services/challenge.service";
import { ShowAllChallengeResponse } from "@/api/payloads/challenge.payload";
import { shortDateFormatter } from "../kanban/Kanban";
import { toast } from "sonner";
import type { Role } from "@/lib/roles";

type Challenge = ShowAllChallengeResponse;

type Props = {
  companyId?: string;
  role?: Role;
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
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  const handleReturnToKanban = async (challengeId: string) => {
    try {
      setActionLoading(challengeId);
      await ChallengeService.changeStatus(challengeId, { status: "GENERATION" });
      
      // Remove o desafio da lista após retornar ao kanban
      setItems((prev) => prev.filter((c) => c.id !== challengeId));
      toast.success("Desafio retornado ao kanban com sucesso.");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? "Erro ao retornar desafio ao kanban.");
    } finally {
      setActionLoading(null);
    }
  };

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);

      try {
        const params: Record<string, string> = {};

        if (role === "ADMINISTRATOR" && companyId) {
          params.enterpriseId = companyId;
        } else if (viewerCompanyId) {
          params.enterpriseId = viewerCompanyId;
        }

        const data: any[] = await ChallengeService.showHistorical(params);

        // Filtra apenas aprovados/reprovados
        let scoped = (data ?? []).filter((c: any) => {
          const s = String(c.status ?? "").toUpperCase();
          return s === "APPROVE" || s === "DISAPPROVE" || s === "FUTURE_BACKLOG";
        });

        // COLLABORATOR — só vê os próprios
        if (role === "COLLABORATOR" && viewerCompanyId) {
          scoped = scoped.filter(
            (c) => String(c.enterpriseId) === String(viewerCompanyId)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVE": return "bg-emerald-600";
      case "DISAPPROVE": return "bg-red-600";
      case "FUTURE_BACKLOG": return "bg-rose-600";
      default: return "bg-slate-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "APPROVE": return "Aprovado";
      case "DISAPPROVE": return "Recusado";
      case "FUTURE_BACKLOG": return "Backlog Futuro";
      default: return status;
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
        Ainda não há desafios aprovados ou recusados.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full p-2">
      {items.map((challenge) => {
        const isPublic = challenge.visibility === "PUBLIC";
        const when = challenge.updatedAt ?? challenge.createdAt ?? undefined;

        return (
          <div
            key={challenge.id}
            className="border border-gray-200 dark:border-gray-800 dark:bg-gray-900 bg-white rounded-xl p-5 gap-2 flex flex-col hover:scale-[1.02] transition-transform"
          >
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-300">
                {challenge.name}
              </h2>
            </div>

            <div className="">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                <span className={`w-3 h-3 rounded-full ${getStatusColor(challenge.status)}`} />
                {getStatusLabel(challenge.status)}
              </div>

              {when && (
                <div className="flex items-center gap-2 mt-2 text-gray-600 dark:text-gray-300 text-sm">
                  <Calendar size={16} />
                  {shortDateFormatter.format(new Date(when))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
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

              {challenge.status === "FUTURE_BACKLOG" && (
                <button
                  onClick={() => handleReturnToKanban(challenge.id)}
                  disabled={actionLoading === challenge.id}
                  className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-white bg-[#15358c] hover:bg-[#0f2557] disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                >
                  <ArrowLeft size={14} />
                  {actionLoading === challenge.id ? "Retornando..." : "Voltar para o kanban"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}