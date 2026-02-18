"use client";

import { Building2, Mail, Check, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StartupMatchResponse } from "@/api/payloads/match.payload";

type MatchListItemProps = {
  match: StartupMatchResponse;
  variant: "sent" | "invite" | "accepted";
  onAccept?: (id: string) => void;
  onDeny?: (id: string) => void;
  onView?: (id: string) => void;
};

export function MatchListItem({ match, variant, onAccept, onDeny, onView }: MatchListItemProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-border bg-card dark:bg-gray-800 p-5 animate-fade-in">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-display font-semibold text-card-foreground truncate">
            {match.Challenge?.name || "Desafio"}
          </h4>
          {variant === "accepted" && (
            <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2 py-1 rounded shrink-0">
              Aceito
            </span>
          )}
          {variant === "sent" && (
            <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs px-2 py-1 rounded shrink-0">
              Pendente
            </span>
          )}
          {variant === "invite" && (
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded shrink-0">
              Convite
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5" />
            <span>{match.Enterprise?.name || "Empresa"}</span>
          </div>
          {match.Enterprise?.gestorEmail && (
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              <span>{match.Enterprise.gestorEmail}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {variant === "sent" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeny?.(match.id)}
            className="text-red-600 hover:bg-red-50 hover:text-red-600 border-red-300 dark:hover:bg-red-950"
          >
            <X className="h-4 w-4 mr-1" />
            Cancelar
          </Button>
        )}
        {variant === "invite" && (
          <>
            <Button size="sm" onClick={() => onAccept?.(match.id)} className="bg-[#15358D] hover:bg-[#112c75] text-white">
              <Check className="h-4 w-4 mr-1" />
              Aceitar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDeny?.(match.id)}
              className="text-red-600 hover:bg-red-50 hover:text-red-600 border-red-300 dark:hover:bg-red-950"
            >
              <X className="h-4 w-4 mr-1" />
              Recusar
            </Button>
          </>
        )}

      </div>
    </div>
  );
}
