"use client";

import { useEffect, useState, useCallback } from "react";
import { Eye, EyeOff, Trash2, Search, X } from "lucide-react";
import { getCurrentUser, type AuthUser } from "@/lib/auth";
import { ChallengeService } from "@/api/services/challenge.service";
import { matchService } from "@/api/services/match.service";
import { useStore } from "../../../store";
import ApplyChallengeModal from "../startup/ApplyChallengeModal";
import { Button } from "../ui/button";
import { toast } from "sonner";
import type { Role } from "@/lib/roles";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [orderBy, setOrderBy] = useState<"createdAt" | "name" | "proponentName" | "proponentArea" | "status">("createdAt");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");
  const [debouncedSearch, setDebouncedSearch] = useState(search); 

  const limit = 16;

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const fetchChallenges = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const response = await ChallengeService.paginatedChallenges({
        page,
        limit,
        search: debouncedSearch || undefined,
        status,
        orderBy,
        orderDirection,
      });

      const raw = response.data ?? [];
      const total = response.meta?.lastPage ?? 1;

      const filtered = filterChallengesByRole(raw, user.role, user, onlyMine);

      setChallenges(filtered);
      setTotalPages(total);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
        err?.message ??
        "Erro ao carregar desafios."
      );
    } finally {
      setLoading(false);
    }
  }, [user, page, debouncedSearch, status, orderBy, orderDirection, onlyMine]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges, reload]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); 

    return () => clearTimeout(timer);
  }, [search])

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

  const isStartup = user?.role === "STARTUP";
  const isObserver = user?.role === "OBSERVER";

  return (
    <>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between w-full">
        <div className="flex-1 flex flex-col md:flex-row gap-4 w-full">
          <div className="flex items-center gap-2 flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 shadow-sm">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                aria-label="Limpar busca"
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
         <Select
            value={status || "ALL"}
            onValueChange={(value) => {
              setPage(1);
              setStatus(value === "ALL" ? undefined : value);
            }}
          >
            <SelectTrigger className="bg-white dark:bg-gray-900">
              <SelectValue placeholder="Todos Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos Status</SelectItem>
              <SelectItem value="GENERATION">Desafio</SelectItem>
              <SelectItem value="PRE_SCREENING">Pré-Triagem</SelectItem>
              <SelectItem value="DETAILED_SCREENING">Triagem Detalhada</SelectItem>
              <SelectItem value="MATERIALIZATION">Materialização</SelectItem>
              <SelectItem value="EXPERIMENTATION">Experimentação</SelectItem>
              <SelectItem value="SCALE">Escala</SelectItem>
              <SelectItem value="APPROVE">Aprovado</SelectItem>
              <SelectItem value="DISAPPROVE">Reprovado</SelectItem>
            </SelectContent>
          </Select>

      <Select
        value={`${orderBy}-${orderDirection}`}
        onValueChange={(value) => {
          const [field, direction] = value.split("-");
          setOrderBy(field as any);
          setOrderDirection(direction as any);
        }}
      >
        <SelectTrigger className="bg-white dark:bg-gray-900">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt-desc">Mais recentes</SelectItem>
          <SelectItem value="createdAt-asc">Mais antigos</SelectItem>
          <SelectItem value="name-asc">Nome A-Z</SelectItem>
          <SelectItem value="name-desc">Nome Z-A</SelectItem>
          <SelectItem value="status-asc">Status A-Z</SelectItem>
          <SelectItem value="status-desc">Status Z-A</SelectItem>
        </SelectContent>
      </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full p-2">
        {challenges.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-sm">
              Nenhum desafio encontrado.
            </p>
          </div>
        ) : (
          challenges.map((challenge) => {
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
            })
          )}
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <Button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          variant="outline"
        >
          Anterior
        </Button>

        <span className="text-sm">
          Página {page} de {totalPages}
        </span>

        <Button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          variant="outline"
        >
          Próxima
        </Button>
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