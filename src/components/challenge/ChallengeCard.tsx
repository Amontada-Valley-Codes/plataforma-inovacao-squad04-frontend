// src/components/startup/ChallengeCard.tsx
"use client";

import React from "react";
import { Tag, Calendar, Eye, EyeOff, MoreHorizontal } from "lucide-react";
import { challengesData } from "@/mocks/ChallengeData";
import { getUserRole } from "@/lib/auth";
import { useSearchParams } from "next/navigation";
import ApplyButton from "./ApplyButton";


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
  companyId?: number;
  startupId?: number;
};

type Role = "admin" | "gestor" | "avaliador" | "usuario" | "startup";

type Props = {
  companyId?: number;
  isAdminView?: boolean;
  onlyMine?: boolean;
  authorName?: string;
  viewerCompanyId?: number;
  canApply?: boolean;
  startupId?: number | string;
  onApply?: (challengeId: number) => void;
};

const STORAGE_PREFIX = "appliedChallenges";

function parseRoleFromQS(v: string | null): Role | null {
  if (!v) return null;
  const val = v.toLowerCase();
  return ["admin", "gestor", "avaliador", "usuario", "startup"].includes(val)
    ? (val as Role)
    : null;
}

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

  // role
  const searchParams = useSearchParams();
  const roleQS = parseRoleFromQS(searchParams?.get("role") ?? null);
  const [role, setRole] = React.useState<Role | null>(null);

  React.useEffect(() => {
    let cancel = false;
    getUserRole()
      .then((r) => {
        if (cancel) return;
        setRole(roleQS ?? ((r as Role) ?? null));
      })
      .catch(() => setRole(roleQS ?? null));
    return () => {
      cancel = true;
    };
  }, [roleQS]);

  const allowApply = Boolean(canApply && role === "startup");

  // persistência
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
    } catch {}
  }, [storageKey]);

  function persistApplied(next: Set<number>) {
    localStorage.setItem(storageKey, JSON.stringify(Array.from(next)));
    setApplied(next);
  }

  function handleApply(challengeId: number) {
    const next = new Set(applied);
    next.add(challengeId);
    persistApplied(next);
    onApply?.(challengeId);
  }

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

  const filtered = React.useMemo(() => {
    let base = data;
    if (typeof companyId === "number") base = base.filter((c) => c.companyId === companyId);
    if (isAdminView) return base;

    if (onlyMine) {
      const nameToUse = authorName?.trim();
      if (!nameToUse) return [];
      const inCompany = (c: Challenge) =>
        typeof viewerCompanyId === "number" ? c.companyId === viewerCompanyId : true;
      return base.filter((c) => c.Author === nameToUse && inCompany(c));
    }

    return base.filter((c) => c.Visibility === "Public");
  }, [data, companyId, isAdminView, onlyMine, authorName, viewerCompanyId]);

  if (!filtered.length) {
    return (
      <div className="w-full p-6 text-sm text-gray-500 dark:text-[#ced3db]">
        Ainda não há desafios para exibir.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full p-4">
      {filtered.map((challenge) => {
        const isPublic = challenge.Visibility === "Public";
        const alreadyApplied = applied.has(challenge.id);

        return (
          <div
            key={challenge.id}
            className="border border-gray-200 dark:border-gray-800 dark:bg-gray-900 bg-white rounded-xl overflow-hidden hover:scale-[1.01] transition-transform shadow-sm hover:shadow-md"
          >
            {/* detalhe topo */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#15358D]/85 via-[#15358D]/35 to-[#15358D]/10" />

            {/* corpo — espaçamento enxuto */}
            <div className="p-4 flex flex-col gap-2.5">
              <div className="flex justify-between items-start">
                <div className="min-w-0">
                  <h2
                    title={challenge.ChallengeTitle}
                    className="text-[15px] font-semibold text-blue-900 dark:text-blue-300 leading-snug truncate"
                  >
                    {challenge.ChallengeTitle}
                  </h2>
                  <p className="text-gray-500 dark:text-[#ced3db] text-sm truncate">
                    {challenge.Author}
                  </p>
                </div>
                <button aria-label="Mais opções">
                  <MoreHorizontal className="text-gray-400 dark:text-[#ced3db] hover:text-gray-600 cursor-pointer" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-[13px]">
                  <Tag size={15} /> {challenge.Category}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-[13px]">
                  <span className={`w-3 h-3 rounded-full ${getStatusColor(challenge.Status)}`} />
                  {challenge.Status}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-[13px]">
                  <Calendar size={15} /> {challenge.Date}
                </div>
              </div>

              <div className="text-gray-600 dark:text-[#ced3db] text-[13px] flex items-center gap-1">
                {isPublic ? (
                  <>
                    <Eye size={16} /> Público
                  </>
                ) : (
                  <>
                    <EyeOff size={16} /> Privado
                  </>
                )}
              </div>
            </div>

            {/* rodapé — metade do espaçamento */}
            {allowApply && isPublic && (
              <div className="border-t border-slate-100/80 dark:border-gray-800 px-4 pt-1 pb-2">
                <ApplyButton
                  applied={alreadyApplied}
                  onApply={async () => handleApply(challenge.id)}
                  labelApply="Candidatar-se"
                  labelApplied="Solicitado"
                  className="w-full"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
