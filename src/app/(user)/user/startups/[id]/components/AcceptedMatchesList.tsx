"use client";

import { Building2, CheckCircle } from "lucide-react";
import { EnterpriseMatchResponse } from "@/api/payloads/match.payload";

interface AcceptedMatchesListProps {
  matches: EnterpriseMatchResponse[];
}

export default function AcceptedMatchesList({ matches }: AcceptedMatchesListProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
        Matches Aceitos
      </h3>
      <div className="space-y-3">
        {matches.map((match) => (
          <div
            key={match.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-border dark:border-gray-700 bg-card dark:bg-gray-800 hover:bg-muted/30 p-5 animate-fade-in shadow-sm"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-display font-semibold text-card-foreground truncate">
                  {match.Challenge?.name || "Desafio"}
                </h4>
                <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2 py-1 rounded shrink-0">
                  Aceito
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Match confirmado</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {matches.length === 0 && (
          <p className="text-center py-10 text-muted-foreground">
            Nenhum match aceito encontrado.
          </p>
        )}
      </div>
    </section>
  );
}
