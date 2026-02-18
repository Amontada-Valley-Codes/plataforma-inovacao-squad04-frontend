"use client";

import { Button } from "@/components/ui/button";
import { Building2, Check, X, Ban } from "lucide-react";
import { EnterpriseMatchResponse } from "@/api/payloads/match.payload";

interface PendingMatchesListProps {
  applications: EnterpriseMatchResponse[];
  invites: EnterpriseMatchResponse[];
  onAccept: (matchId: string) => void;
  onDeny: (matchId: string) => void;
  onCancel: (matchId: string) => void;
}

export default function PendingMatchesList({
  applications,
  invites,
  onAccept,
  onDeny,
  onCancel,
}: PendingMatchesListProps) {
  const allPending = [
    ...applications.map((m) => ({ ...m, type: "application" as const })),
    ...invites.map((m) => ({ ...m, type: "invite" as const })),
  ];

  return (
    <section className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Ban className="w-5 h-5 text-orange-500 dark:text-orange-400" />
        Pendências de Match
      </h3>
      <p className="text-sm text-muted-foreground">
        Candidaturas recebidas e convites enviados aguardando resposta.
      </p>
      <div className="space-y-3">
        {allPending.map((match) => (
          <div
            key={match.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-border dark:border-gray-700 bg-card dark:bg-gray-800 p-5 animate-fade-in shadow-sm"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-display font-semibold text-card-foreground truncate">
                  {match.Challenge?.name || "Desafio"}
                </h4>
                {match.type === "application" ? (
                  <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs px-2 py-1 rounded shrink-0">
                    Candidatura Recebida
                  </span>
                ) : (
                  <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded shrink-0">
                    Convite Enviado
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>
                    {match.type === "application"
                      ? "Aguardando sua aprovação"
                      : "Aguardando resposta da startup"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {match.type === "application" && (
                <>
                  <Button
                    size="sm"
                    onClick={() => onAccept(match.id)}
                    className="bg-[#15358D] hover:bg-[#112c75] text-white font-semibold"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Aceitar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeny(match.id)}
                    className="text-red-600 hover:bg-red-50 hover:text-red-600 border-red-300 dark:hover:bg-red-950"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Recusar
                  </Button>
                </>
              )}
              {match.type === "invite" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCancel(match.id)}
                  className="text-red-600 hover:bg-red-50 hover:text-red-600 border-red-300 dark:hover:bg-red-950"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancelar
                </Button>
              )}
            </div>
          </div>
        ))}
        {allPending.length === 0 && (
          <p className="text-center py-10 text-muted-foreground">
            Nenhuma pendência encontrada.
          </p>
        )}
      </div>
    </section>
  );
}
