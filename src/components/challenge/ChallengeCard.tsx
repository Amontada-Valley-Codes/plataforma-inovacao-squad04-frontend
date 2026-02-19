/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect, useState } from "react";
import { Tag, Eye, EyeOff } from "lucide-react";
import { getUserRole } from "@/lib/auth";
import { useSearchParams } from "next/navigation";
import { ChallengeService } from "@/api/services/challenge.service";
import { enterpriseService } from "@/api/services/enterprise.service";
import { useStore } from "../../../store";
import ApplyChallengeModal from "../startup/ApplyChallengeModal";
import { matchService } from "@/api/services/match.service";
import { Button } from "../ui/button";
import { toast } from "sonner";

type Status = "Completed" | "In Progress" | "Pending" | string;

type Challenge = {
  id: string;
  name: string;

  startDate?: string;
  endDate?: string;
  area?: string;
  description?: string;

  visibility: string;
  status: string;
  strategic_alignment?: string;
  innovative_potential?: string;
  business_relevance?: string;
  updatedAt?: string;
  enterpriseId?: string;
  usersId?: string;
  Users?: {
    name: string;
  };
  enterpriseName?: string;
};


type Role = "admin" | "gestor" | "avaliador" | "usuario" | "startup";

type Props = {
  companyId?: number;
  isAdminView?: boolean;
  onlyMine?: boolean;
  authorId?: string;          
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

/** Decodificador JWT para client-side */
function decodeJwtPayload<T = any>(token: string): T | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json =
      typeof window !== "undefined"
        ? window.atob(b64)
        : Buffer.from(b64, "base64").toString("utf-8");
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/** Obtém dados do token JWT no localStorage */
function getAuthFromLocalStorage(): {
  sub?: string;
  enterpriseId?: string | null;
  type_user?: string;
} {
  if (typeof window === "undefined") return {};
  const possibleKeys = ["access_token", "token", "auth_token"];
  for (const k of possibleKeys) {
    const t = localStorage.getItem(k);
    if (t) {
      const p = decodeJwtPayload<any>(t) || {};
      return {
        sub: p.sub ?? p.userId ?? p.id,         
        enterpriseId: p.enterpriseId ?? p.companyId ?? p.orgId ?? null,
        type_user: p.type_user,
      };
    }
  }
  return {};
}

function getOwnerId(c: any): string | undefined {
  return (
    c?.usersId ??
    c?.userId ??
    c?.createdById ??
    c?.created_by_id ??
    c?.ownerId ??
    c?.owner_id ??
    undefined
  );
}

export default function ChallengeCard({
  isAdminView = false,
  onlyMine = false,
  authorId,                      
  authorName,
  canApply = false,
  startupId
}: Props) {
  const [data, setData] = useState<Challenge[]>([]);
  const { reload } = useStore();
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [myUserId, setMyUserId] = useState<string | undefined>();
  const [myEnterpriseId, setMyEnterpriseId] = useState<string | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalChallenge, setModalChallenge] = useState<Challenge | null>(null);

  const searchParams = useSearchParams();
  const roleQS = parseRoleFromQS(searchParams?.get("role") ?? null);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    let cancel = false;
    getUserRole()
      .then((r) => {
        if (cancel) return;
        const v = String(r ?? "").toLowerCase();
        const map: Record<string, Role> = {
          usuario: "usuario", user: "usuario",
          gestor: "gestor", manager: "gestor",
          avaliador: "avaliador", evaluator: "avaliador", reviewer: "avaliador",
          startup: "startup", startup_user: "startup",
          admin: "admin", administrator: "admin",
        };
        setRole(roleQS ?? (map[v] ?? null));
      })
      .catch(() => setRole(roleQS ?? null));
    return () => { cancel = true; };
  }, [roleQS]);

  async function fetchChallenges() {
    try {
      setLoading(true);
      setErrMsg(null);

      let response: Challenge[] = [];

      if (role === "startup" || !role) {
        // público - agora com enterpriseId disponível
        const publicList = await ChallengeService.showAllPublicChallenges();
        response = publicList.map((p: any) => ({
          id: p.id,
          name: p.name,
          startDate: p.endDate,
          endDate: p.endDate,
          area: "OTHER",
          description: "",
          visibility: p.visibility,
          status: p.status,
          strategic_alignment: "",
          innovative_potential: "",
          business_relevance: "",
          updatedAt: p.endDate,
          enterpriseId: p.Enterprise?.id || "",
          usersId: "",
          Users: { name: "" },
          enterpriseName: p.Enterprise?.name ?? "Empresa não informada",
        }));
      } else {
        // autenticado
        const privateList = await ChallengeService.showAllChallenges();
        let filtered = privateList;

        if (onlyMine && authorId) {
          filtered = filtered.filter((c) => String(getOwnerId(c)) === String(authorId));
        }

        if (role === "usuario" && !onlyMine && myUserId) {
          filtered = filtered.filter((c) => String(getOwnerId(c)) === String(myUserId));
        }

        const enterpriseIds = [...new Set(filtered.map((c) => c.enterpriseId))];
        const enterpriseResponses = await Promise.all(
          enterpriseIds.map(async (id) => {
            try {
              const ent = await enterpriseService.showOneEnterprise(id);
              return { id, name: ent?.name || "Empresa sem nome" };
            } catch {
              return { id, name: "Empresa desconhecida" };
            }
          })
        );

        const enterpriseMap: Record<string, string> = {};
        enterpriseResponses.forEach((e) => {
          enterpriseMap[e.id] = e.name;
        });

        response = filtered.map((challenge) => ({
          ...challenge,
          strategic_alignment: challenge.strategic_alignment ?? undefined,
          innovative_potential: challenge.innovative_potential ?? undefined,
          business_relevance: challenge.business_relevance ?? undefined,
          enterpriseName:
            enterpriseMap[challenge.enterpriseId] || "Empresa não informada",
        }));
      }

      setData(response);
    } catch (err: any) {
      console.error("Erro ao buscar desafios:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Não foi possível carregar os desafios.";
      setErrMsg(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const { sub, enterpriseId } = getAuthFromLocalStorage();
    if (sub) setMyUserId(String(sub));
    if (enterpriseId) setMyEnterpriseId(String(enterpriseId));
    
    if (role !== null) {
      fetchChallenges();
    }
  }, [reload, role, authorId]);

  const handleApply = async (challenge: Challenge) => {
    if (!challenge || !startupId) {
      toast.error("Erro: Dados incompletos");
      return;
    }

    if (!challenge.enterpriseId) {
      toast.error(
        "Erro: Este desafio não possui empresa associada. Entre em contato com o suporte."
      );
      return;
    }

    try {
      await matchService.sendApplication(challenge.id, challenge.enterpriseId);
      toast.success("Candidatura enviada com sucesso!");
      setModalOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao enviar candidatura");
    }
  };


  const storageKey = React.useMemo(() => {
    const sid = startupId ?? "anon";
    return `${STORAGE_PREFIX}:${sid}`;
  }, [startupId]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const filtered = React.useMemo(() => {
    let base = data;

    if (onlyMine && !authorId) {
      const nameToUse = authorName?.trim();
      if (!nameToUse) return [];
      base = base.filter((c) => (c.Users?.name ?? "").trim() === nameToUse);
    }

    if (!isAdminView) {
      base = base.filter((c) => {
        const v = (c.visibility || "").toLowerCase();
        return v === "public" || v === "private";
      });
    }

    switch (role) {
      case "admin":
        break;
      case "gestor":
      case "avaliador":
        if (myEnterpriseId) {
          base = base.filter(
            (c) => String(c.enterpriseId) === String(myEnterpriseId)
          );
        } else base = [];
        break;
      case "usuario":
        if (!onlyMine && myUserId) {
          base = base.filter((c) => String(getOwnerId(c)) === String(myUserId));
        } else if (!onlyMine && !myUserId) {
          base = [];
        }
        break;
      case "startup":
        base = base.filter((c) => (c.visibility || "").toLowerCase() === "public");
        break;
      default:
        base = base.filter((c) => (c.visibility || "").toLowerCase() === "public");
        break;
    }

    return base;
  }, [data, isAdminView, onlyMine, authorId, authorName, role, myEnterpriseId, myUserId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground dark:text-gray-400">Carregando </p>
        </div>
      </div>
    );
  }

  return (
    <>
      
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full p-2">
          {filtered.map((challenge) => {
            const isPublic = (challenge.visibility || "").toLowerCase() === "public";
            const alreadyApplied = new Set<string>([]).has(challenge.id);

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
                      className="text-[15px] font-semibold text-[#15358D] dark:text-blue-800 leading-snug truncate"
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
                </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-[13px]">
                      <Tag size={15} /> {"Sem categoria"}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-[13px]">
                      <span className={`w-3 h-3 rounded-full ${getStatusColor(challenge.status)}`} />
                      {stageTranslations[challenge.status] || challenge.status}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-[13px]">
                      {/* <Calendar size={15} />{" "} */}
                      {/* {new Date(challenge.startDate).toLocaleDateString("pt-BR")} -{" "}
                      {new Date(challenge.endDate).toLocaleDateString("pt-BR")} */}
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

                {Boolean(canApply && role === "startup" && isPublic) && (
                  <div className="border-top border-slate-100/80 dark:border-gray-800 px-4 pt-1 pb-2">
                    <Button
                      onClick={() => {
                        setModalChallenge(challenge);
                        setModalOpen(true);
                      }}
                      className="w-full bg-[#15358D] hover:bg-[#112c75] text-white"
                    >
                      Candidatar-se
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      {modalChallenge && (
        <ApplyChallengeModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          challengeName={modalChallenge.name}
          enterpriseName={modalChallenge.enterpriseName || "Empresa"}
          deadline={modalChallenge.endDate}
          onConfirm={() => handleApply(modalChallenge)}
        />
      )}
    </>
  );
}
