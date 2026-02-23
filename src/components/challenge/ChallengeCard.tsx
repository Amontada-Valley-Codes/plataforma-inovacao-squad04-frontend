"use client";

import { useEffect, useState, useCallback } from "react";
import { Tag, Eye, EyeOff, Trash2 } from "lucide-react";
import { getCurrentUser, type AuthUser } from "@/lib/auth";
import { ChallengeService } from "@/api/services/challenge.service";
import { matchService } from "@/api/services/match.service";
import { useStore } from "../../../store";
import ApplyChallengeModal from "../startup/ApplyChallengeModal";
import { Button } from "../ui/button";
import { toast } from "sonner";
import type { Role } from "@/lib/roles";
import { ShowLoggedUserResponse } from "@/api/payloads/user.payload";

type Challenge = {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  visibility: string;
  status: string;
  enterpriseId?: string;
  enterpriseName?: string;
  usersId?: string;
  Users?: { name: string };
  strategic_alignment?: string | null;
  innovative_potential?: string | null;
  business_relevance?: string | null;
  updatedAt?: string | null;
};

type Props = {
  onlyMine?: boolean;
  canApply?: boolean;
  startupId?: string;
};


const STAGE_LABELS: Record<string, string> = {
  GENERATION: "Desafio",
  PRE_SCREENING: "Pré-Triagem",
  DETAILED_SCREENING: "Triagem Detalhada",
  MATERIALIZATION: "Materialização",
  EXPERIMENTATION: "Experimentação",
  SCALE: "Escala",
  FUTURE_BACKLOG: "Backlog do Futuro",
  PENDING: "Pendente",
  APPROVE: "Aprovado",
  DISAPPROVE: "Reprovado",
};

const colors: Record<string, string> = {
    GENERATION: "bg-violet-500",      
    PRE_SCREENING: "bg-amber-500",     
    DETAILED_SCREENING: "bg-orange-500",
    MATERIALIZATION: "bg-blue-500",     
    EXPERIMENTATION: "bg-teal-500", 
    SCALE: "bg-green-600",              
    FUTURE_BACKLOG: "bg-rose-600",    
    PENDING: "bg-yellow-500",          
    APPROVE: "bg-emerald-600",          
    DISAPPROVE: "bg-red-600",         
    DEFAULT: "bg-gray-500",             
  };

function filterChallengesByRole(
  challenges: Challenge[],
  role: Role,
  user: AuthUser,
  onlyMine: boolean
): Challenge[] {
  switch (role) {
    case "ADMINISTRATOR":

      return challenges;
    case "MANAGER":
    case "INNOVATION_TEAM":
    case "TRANSFORMATION_OFFICE":
    case "STEERING_COMMITTEE":
      
      return challenges.filter(
        (c) => c.enterpriseId === user.enterpriseId
      );
    case "OBSERVER":
      return challenges.filter(
        (c) => c.enterpriseId === user.enterpriseId
      );

    case "COLLABORATOR":
      return challenges.filter(
        (c) => c.usersId === user.id
      );

    case "STARTUP":
      return challenges.filter(
        (c) => c.visibility?.toLowerCase() === "public"
      );
    default:
      return [];
  }
}



export default function ChallengeCard({
  onlyMine = false,
  canApply = false,
  startupId,
}: Props) {
  const { reload } = useStore();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalChallenge, setModalChallenge] = useState<Challenge | null>(null);
  const [loggedUser, setLoggedUser] = useState<ShowLoggedUserResponse | null>(null)

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const fetchChallenges = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      let raw: Challenge[] = [];

      if (user.role === "STARTUP") {
        raw = await ChallengeService.showAllPublicChallenges();
      } else {
        raw = await ChallengeService.showAllChallenges();
      }

      const filtered = filterChallengesByRole(raw, user.role, user, onlyMine);
      setChallenges(filtered);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } }; message?: string })
          ?.response?.data?.message ??
        (err as { message?: string })?.message ??
        "Não foi possível carregar os desafios.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user, onlyMine]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges, reload]);

  const handleApply = async (challenge: Challenge) => {
    if (!startupId || !challenge.enterpriseId) {
      toast.error("Erro: Dados incompletos para candidatura.");
      return;
    }
    try {
      await matchService.sendApplication(challenge.id, challenge.enterpriseId);
      toast.success("Candidatura enviada com sucesso!");
      setModalOpen(false);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ?? "Erro ao enviar candidatura.";
      toast.error(message);
    }
  };

  const deleteChallenge = async (challengeId: string) => {
    try {
      await ChallengeService.deleteChallenge(challengeId)
      toast.success("Desafio deletado com sucesso!")
      window.location.reload()
    } catch (err: any) {
      console.error(err)
      toast.error("Erro ao deletar desafio.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground dark:text-gray-400">Carregando desafios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (challenges.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground text-sm">Nenhum desafio encontrado.</p>
      </div>
    );
  }


  const isStartup = user?.role === "STARTUP";
  const isObserver = user?.role === "OBSERVER";

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full p-2">
        {challenges.map((challenge) => {
          const isPublic = challenge.visibility?.toLowerCase() === "public";

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
                    <span className={`w-3 h-3 rounded-full ${colors[challenge.status ?? colors.DEFAULT]}`} />
                    {STAGE_LABELS[challenge.status] || challenge.status}
                  </div>
                </div>

                <div className="text-gray-600 dark:text-[#ced3db] text-[13px] flex justify-between items-center gap-1">
                  {isPublic ? (
                    <div className="flex items-center gap-2">
                      <Eye size={16} /> Público
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <EyeOff size={16} /> Privado
                    </div>
                  )}
                  <div>
                    {user?.role === "MANAGER" && (
                      <Trash2
                        size={16}
                        className="cursor-pointer hover:scale-110 hover:text-gray-800 transition-all"
                        onClick={() => deleteChallenge(challenge.id)}
                      />
                    )}
                  </div>
                </div>
              </div>

              {canApply && isStartup && isPublic && (
                <div className="border-t border-slate-100/80 dark:border-gray-800 px-4 pt-1 pb-2">
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

              {isObserver && (
                <div className="border-t border-slate-100/80 dark:border-gray-800 px-4 pt-1 pb-2">
                  <span className="text-xs text-muted-foreground">Somente visualização</span>
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