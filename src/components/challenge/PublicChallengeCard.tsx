"use client";

import { useEffect, useState } from "react";
import { Eye, Search, X } from "lucide-react";
import { ChallengeService } from "@/api/services/challenge.service";
import { matchService } from "@/api/services/match.service";
import ApplyChallengeModal from "../startup/ApplyChallengeModal";
import { Button } from "../ui/button";
import { toast } from "sonner";

type PublicChallenge = {
  id: string;
  name: string;
  status: string;
  visibility: string;
  startDate?: string;
  endDate: string;
  Enterprise: {
    name: string;
  };
};

type Props = {
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

export default function PublicChallengeCard({ startupId }: Props) {
  const [challenges, setChallenges] = useState<PublicChallenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<PublicChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalChallenge, setModalChallenge] = useState<PublicChallenge | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchPublicChallenges() {
      try {
        setLoading(true);
        setError(null);
        const data = await ChallengeService.showAllPublicChallenges();
        const challengesList = Array.isArray(data) ? data : [];
        setChallenges(challengesList);
        setFilteredChallenges(challengesList);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ??
          err?.message ??
          "Erro ao carregar desafios públicos."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPublicChallenges();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredChallenges(challenges);
    } else {
      const filtered = challenges.filter((challenge) =>
        challenge.name.toLowerCase().includes(search.toLowerCase()) ||
        challenge.Enterprise.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredChallenges(filtered);
    }
  }, [search, challenges]);

  const handleApply = async (challenge: PublicChallenge) => {
    if (!startupId) {
      toast.error("Erro: Dados incompletos para candidatura.");
      return;
    }
    try {
      const enterpriseId = (challenge as any).Enterprise?.id;
      if (!enterpriseId) {
        const fullChallenge = await ChallengeService.showOnePublicChallenge(challenge.id);
        await matchService.sendApplication(challenge.id, fullChallenge.enterpriseId!);
      } else {
        await matchService.sendApplication(challenge.id, enterpriseId);
      }
      toast.success("Candidatura enviada com sucesso!");
      setModalOpen(false);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ?? "Erro ao enviar candidatura.";
      toast.error(message);
    }
  };

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

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between w-full">
        <div className="flex-1 flex flex-col md:flex-row gap-4 w-full">
          <div className="flex items-center gap-2 flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 shadow-sm">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou empresa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Limpar busca"
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full p-2">
        {filteredChallenges.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-sm">
              {search ? "Nenhum desafio encontrado com esse termo." : "Nenhum desafio público disponível."}
            </p>
          </div>
        ) : (
          filteredChallenges.map((challenge) => (
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
                      {challenge.Enterprise.name}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-[13px]">
                    <span className={`w-3 h-3 rounded-full ${colors[challenge.status] ?? colors.DEFAULT}`} />
                    {STAGE_LABELS[challenge.status] || challenge.status}
                  </div>
                </div>

                <div className="text-gray-600 dark:text-[#ced3db] text-[13px] flex justify-between items-center gap-1">
                  <div className="flex items-center gap-2">
                    <Eye size={16} /> Público
                  </div>
                </div>
              </div>

              {startupId && (
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
            </div>
          ))
        )}
      </div>

      {modalChallenge && (
        <ApplyChallengeModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          challengeName={modalChallenge.name}
          enterpriseName={modalChallenge.Enterprise.name}
          deadline={undefined}
          onConfirm={() => handleApply(modalChallenge)}
        />
      )}
    </>
  );
}
