"use client";

import React, { useEffect, useState } from "react";
import { Tag, Calendar, Eye, EyeOff, MoreHorizontal } from "lucide-react";
import { getUserRole } from "@/lib/auth";
import { useSearchParams } from "next/navigation";
import ApplyButton from "./ApplyButton";
import ApplyModal from "@/components/startup/ApplyModal";
import { ChallengeService } from "@/api/services/challenge.service";
import { enterpriseService } from "@/api/services/enterprise.service";

type Status = "Completed" | "In Progress" | "Pending" | string;

type Challenge = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  area: string;
  description: string;
  visibility: string;
  status: string;
  strategic_alignment: string;
  innovative_potential: string;
  business_relevance: string;
  updatedAt: string;
  enterpriseId: string;
  usersId: string;
  Users: {
    name: string;
    image: null;
  };
  enterpriseName?: string
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
  onApply?: (challengeId: string) => void;
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
  isAdminView = false,
  onlyMine = false,
  authorName,
  canApply = false,
  startupId,
  onApply,
}: Props) {
  const [data, setData] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const response = await ChallengeService.showAllChallenges();
        setData(response);

        const enterpriseIds = [...new Set(response.map((c) => c.enterpriseId))];

        const enterpriseResponses = await Promise.all(
          enterpriseIds.map(async (id) => {
            try {
              const enterpriseData = await enterpriseService.showOneEnterprises(id);
              return { id, name: enterpriseData?.name || "Empresa sem nome" };
            } catch (err) {
              console.error(`Erro ao buscar empresa ${id}:`, err);
              return { id, name: "Empresa desconhecida" };
            }
          })
        );

        const enterpriseMap: Record<string, string> = {};
        enterpriseResponses.forEach((e) => {
          enterpriseMap[e.id] = e.name;
        });

        setData((prev) =>
          prev.map((challenge) => ({
            ...challenge,
            enterpriseName: enterpriseMap[challenge.enterpriseId] || "Empresa não informada",
          }))
        );
      } catch (err) {
        console.error("Erro ao buscar desafios:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchChallenges();
  }, []);


  // role
  const searchParams = useSearchParams();
  const roleQS = parseRoleFromQS(searchParams?.get("role") ?? null);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
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

  const storageKey = React.useMemo(() => {
    const sid = startupId ?? "anon";
    return `${STORAGE_PREFIX}:${sid}`;
  }, [startupId]);

  const [applied, setApplied] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const arr = JSON.parse(raw) as string[];
      setApplied(new Set(arr));
    } catch {}
  }, [storageKey]);

  function persistApplied(next: Set<string>) {
    localStorage.setItem(storageKey, JSON.stringify(Array.from(next)));
    setApplied(next);
  }

  function markApplied(challengeId: string) {
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

    if (onlyMine) {
      const nameToUse = authorName?.trim();
      if (!nameToUse) return [];
      base = base.filter((c) => c.Users?.name === nameToUse);
    }

    if (!isAdminView) {
      base = base.filter(
        (c) => c.visibility?.toLowerCase() === "public" || "private"
      );
    }

    return base;
  }, [data, isAdminView, onlyMine, authorName]);


  // Estado do modal
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Challenge | null>(null);

  async function handleSubmitFromModal(payload: {
    challengeId: string;
    description: string;
    experience: string;
    files: File[];
  }) {
    markApplied(String(payload.challengeId));
    setOpen(false);
    setSelected(null);
  }

  if (loading) {
    return <div className="p-6 text-gray-500">Carregando desafios...</div>;
  }

  if (!filtered.length) {
    return (
      <div className="w-full p-6 text-sm text-gray-500 dark:text-[#ced3db]">
        Ainda não há desafios para exibir.
      </div>
    );
  }

  const typeTranslations: Record<string, string> = {
    TECHNOLOGY: "Tecnologia",
    HEALTH: "Saúde",
    EDUCATION: "Educação",
    ENVIRONMENT: "Meio Ambiente",
    BUSINESS: "Negócios",
    SOCIAL: "Social",
    ENGINEERING: "Engenharia",
    AGRICULTURE: "Agricultura",
    DESIGN: "Design",
    OTHER: "Outro",
  }; 

  const stageTranslations: Record<string, string> = {
    GENERATION: "Desafio",
    PRE_SCREENING: "Pré-Triagem",
    IDEATION: "Ideação",
    DETAILED_SCREENING: "Triagem detalhada",
    EXPERIMENTATION: "Experimentação",
    APPROVE: "Aprovado",
    DISAPPROVE: "Reprovado",
  };  

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full p-2">
        {filtered.map((challenge) => {
          const isPublic = challenge.visibility === "Public";
          const alreadyApplied = applied.has(challenge.id);

          return (
            <div
              key={challenge.id}
              className="border border-gray-200 dark:border-gray-800 dark:bg-gray-900 bg-white rounded-xl overflow-hidden hover:scale-[1.01] transition-transform shadow-sm hover:shadow-md"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-[#15358D]/85 via-[#15358D]/35 to-[#15358D]/10" />

              <div className="p-4 flex flex-col gap-2.5">
                <div className="flex justify-between items-start">
                  <div className="min-w-0">
                    <h2
                      title={challenge.name}
                      className="text-[15px] font-semibold text-blue-900 dark:text-blue-300 leading-snug truncate"
                    >
                      {challenge.name}
                    </h2>
                    <p className="text-gray-500 dark:text-[#ced3db] text-sm truncate">
                      {challenge.enterpriseName || "Empresa desconhecida"}
                    </p>
                    <p className="text-gray-500 dark:text-[#ced3db] text-sm truncate">
                      {challenge.Users?.name || "Autor desconhecido"}
                    </p>
                  </div>
                  <button aria-label="Mais opções">
                    <MoreHorizontal className="text-gray-400 dark:text-[#ced3db] hover:text-gray-600 cursor-pointer" />
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-[13px]">
                    <Tag size={15} /> {typeTranslations[challenge.area] || "Sem categoria"}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-[13px]">
                    <span className={`w-3 h-3 rounded-full ${getStatusColor(challenge.status)}`} />
                    {stageTranslations[challenge.status]}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-[13px]">
                    <Calendar size={15} /> {new Date(challenge.startDate).toLocaleDateString("pt-BR")} - {new Date(challenge.endDate).toLocaleDateString("pt-BR")}
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

              {allowApply && isPublic && (
                <div className="border-top border-slate-100/80 dark:border-gray-800 px-4 pt-1 pb-2">
                  <ApplyButton
                    applied={alreadyApplied}
                    onApply={() => {
                      setSelected(challenge);
                      setOpen(true);
                    }}
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

      {selected && (
        <ApplyModal
          isOpen={open}
          onClose={() => {
            setOpen(false);
            setSelected(null);
          }}
          challengeId={selected.id}
          challengeTitle={selected.name}
          onSubmit={handleSubmitFromModal}
        />
      )}
    </>
  );
}
