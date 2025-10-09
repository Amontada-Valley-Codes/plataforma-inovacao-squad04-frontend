// src/components/startup/ChallengeCard.tsx
"use client";

import React from "react";
import { Tag, Calendar, Eye, EyeOff, MoreHorizontal } from "lucide-react";
import { challengesData } from "@/mocks/ChallengeData";

/** Status/Visibility livres para manter compat com teu mock */
type Status = "Completed" | "In Progress" | "Pending" | string;
type Visibility = "Public" | "Private" | string;

type Challenge = {
  id: number;
  ChallengeTitle: string;
  Author: string;
  Category: string;
  Status: Status;
  Date: string;
  Visibility: Visibility;
  companyId?: number;   // <- importante para filtros por empresa
  startupId?: number;   // <- opcional se quiseres filtrar por startup depois
};

type Role = "admin" | "gestor" | "avaliador" | "usuario";

type Props = {
  /** Filtro da rota de empresa (ex.: /company/[companyId]/desafios) */
  companyId?: number;
  /** Mostrar tudo (inclusive privados) — típico de admin/gestor no contexto da empresa */
  isAdminView?: boolean;
  /** Mostrar apenas os desafios do autor (usado em /user/meus-desafios) */
  onlyMine?: boolean;
  /** Nome do autor “logado” (passado pela page) */
  authorName?: string;
  /** Empresa do usuário viewer (passado pela page quando onlyMine=true) */
  viewerCompanyId?: number;

  /** ✅ Liga o botão "Candidatar-se" (apenas para desafios públicos) */
  canApply?: boolean;
  /** ✅ Identifica a startup atual (para persistir candidatura em localStorage) */
  startupId?: number | string;
  /** ✅ Callback opcional após aplicar */
  onApply?: (challengeId: number) => void;
};

const STORAGE_PREFIX = "appliedChallenges";

export default function ChallengeCard({
  companyId,
  isAdminView = false,
  onlyMine = false,
  authorName,
  viewerCompanyId,
  canApply = false,
  startupId,
  onApply,
}: Props) {
  const data: Challenge[] = challengesData as Challenge[];

  // ====== Persistência de candidatura por startup ======
  const storageKey = React.useMemo(() => {
    const sid = startupId ?? "anon";
    return `${STORAGE_PREFIX}:${sid}`;
  }, [startupId]);

  const [applied, setApplied] = React.useState<Set<number>>(new Set());

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const arr = JSON.parse(raw) as number[];
      setApplied(new Set(arr));
    } catch {
      // ignore parsing errors
    }
  }, [storageKey]);

  function persistApplied(next: Set<number>) {
    const arr = Array.from(next);
    localStorage.setItem(storageKey, JSON.stringify(arr));
    setApplied(next);
  }

  function handleApply(challengeId: number) {
    const next = new Set(applied);
    next.add(challengeId);
    persistApplied(next);
    onApply?.(challengeId);
  }

  // ====== UI helpers ======
  const getStatusColor = (status: Status) => {
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

  // ====== Filtros ======
  const filtered = React.useMemo(() => {
    let base = data;

    // 1) Se vier companyId da rota, filtra por empresa
    if (typeof companyId === "number") {
      base = base.filter((c) => c.companyId === companyId);
    }

    // 2) ADMIN/GESTOR (isAdminView): vê tudo (público/privado) dentro do escopo acima
    if (isAdminView) {
      return base;
    }

    // 3) onlyMine: mostra apenas os desafios do autor no contexto da empresa do viewer (se houver)
    if (onlyMine) {
      const nameToUse = authorName?.trim();
      if (!nameToUse) {
        // sem authorName não dá pra filtrar "meus"
        return [];
      }
      const inCompany = (c: Challenge) =>
        typeof viewerCompanyId === "number" ? c.companyId === viewerCompanyId : true;

      return base.filter((c) => c.Author === nameToUse && inCompany(c));
    }

    // 4) fallback: apenas públicos (respeitando o companyId, se veio)
    return base.filter((c) => c.Visibility === "Public");
  }, [data, companyId, isAdminView, onlyMine, authorName, viewerCompanyId]);

  if (!filtered.length) {
    return (
      <div className="w-full p-6 text-sm text-gray-500 dark:text-[#ced3db]">
        Ainda não há desafios para exibir.
      </div>
    );
  }

  // ====== Render ======
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full p-4">
      {filtered.map((challenge) => {
        const isPublic = challenge.Visibility === "Public";
        const alreadyApplied = applied.has(challenge.id);

        return (
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

              {/* ✅ Botão Candidatar-se: só aparece se canApply=true e o desafio for Public */}
              {canApply && isPublic && (
                alreadyApplied ? (
                  <button
                    className="rounded-xl border px-3 py-2 text-sm font-medium opacity-70 cursor-default"
                    aria-disabled
                  >
                    ✅ Candidatura enviada
                  </button>
                ) : (
                  <button
                    onClick={() => handleApply(challenge.id)}
                    className="rounded-xl bg-[#15358d] text-white px-3 py-2 text-sm font-semibold hover:opacity-90"
                  >
                    Candidatar-se
                  </button>
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
