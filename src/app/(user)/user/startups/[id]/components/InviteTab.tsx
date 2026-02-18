"use client";

import { useEffect, useState } from "react";
import { Tag, Eye, EyeOff } from "lucide-react";
import { ChallengeService } from "@/api/services/challenge.service";
import { enterpriseService } from "@/api/services/enterprise.service";
import { enterpriseMatchService } from "@/api/services/enterpriseMatch.service";
import { Button } from "@/components/ui/button";
import { showCustomToast } from "@/components/kanban/KanbanToaster";
import InviteStartupModal from "./InviteStartupModal";

interface InviteTabProps {
  startupId: string;
  startupName: string;
}

type Challenge = {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  area?: string;
  description?: string;
  visibility: string;
  status: string;
  enterpriseId?: string;
  enterpriseName?: string;
};

export default function InviteTab({ startupId, startupName }: InviteTabProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const publicList = await ChallengeService.showAllChallenges();
      
      const enterpriseIds = [...new Set(publicList.map((c: any) => c.enterpriseId))];
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

      const mapped = publicList.map((p: any) => ({
        id: p.id,
        name: p.name,
        startDate: p.startDate,
        endDate: p.endDate,
        area: p.area || "OTHER",
        description: p.description || "",
        visibility: p.visibility,
        status: p.status,
        enterpriseId: p.enterpriseId || "",
        enterpriseName: enterpriseMap[p.enterpriseId] || "Empresa não informada",
      }));

      setChallenges(mapped);
    } catch (error) {
      console.error("Erro ao buscar desafios:", error);
      showCustomToast("Erro ao carregar desafios", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!selectedChallenge) return;

    try {
      await enterpriseMatchService.sendInvite(startupId, selectedChallenge.id);
      showCustomToast("Convite enviado com sucesso!", "success");
      setModalOpen(false);
    } catch (error: any) {
      showCustomToast(error?.response?.data?.message || "Erro ao enviar convite", "error");
    }
  };

  const getStatusColor = (status: string) => {
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

  const stageTranslations: Record<string, string> = {
    GENERATION: "Desafio",
    PRE_SCREENING: "Pré-Triagem",
    IDEATION: "Ideação",
    DETAILED_SCREENING: "Triagem detalhada",
    EXPERIMENTATION: "Experimentação",
    APPROVE: "Aprovado",
    DISAPPROVE: "Reprovado",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Convidar {startupName} para Desafios
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Selecione um desafio disponível e envie um convite para a startup participar.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {challenges.map((challenge) => {
          const isPublic = (challenge.visibility || "").toLowerCase() === "public";

          return (
            <div
              key={challenge.id}
              className="border border-border bg-card rounded-xl overflow-hidden hover:scale-[1.01] transition-transform shadow-sm hover:shadow-md"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-[#15358D]/85 via-[#15358D]/35 to-[#15358D]/10" />

              <div className="p-4 flex flex-col gap-2.5">
                <div className="flex justify-between items-start">
                  <div className="min-w-0">
                    <h2
                      title={challenge.name}
                      className="text-[15px] font-semibold text-[#15358D] leading-snug truncate"
                    >
                      {challenge.name}
                    </h2>
                    <p className="text-muted-foreground text-sm truncate">
                      {challenge.enterpriseName}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-[13px]">
                    <Tag size={15} /> {challenge.area || "Sem categoria"}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-[13px]">
                    <span className={`w-3 h-3 rounded-full ${getStatusColor(challenge.status)}`} />
                    {stageTranslations[challenge.status] || challenge.status}
                  </div>
                </div>

                <div className="text-muted-foreground text-[13px] flex items-center gap-1">
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

              <div className="border-t border-border px-4 pt-1 pb-2">
                <Button
                  onClick={() => {
                    setSelectedChallenge(challenge);
                    setModalOpen(true);
                  }}
                  className="w-full bg-[#15358D] hover:bg-[#112c75] text-white"
                >
                  Convidar
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {challenges.length === 0 && (
        <p className="text-center py-10 text-muted-foreground">
          Nenhum desafio disponível no momento.
        </p>
      )}

      {selectedChallenge && (
        <InviteStartupModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          startupName={startupName}
          challengeName={selectedChallenge.name}
          enterpriseName={selectedChallenge.enterpriseName}
          deadline={selectedChallenge.endDate}
          onConfirm={handleInvite}
        />
      )}
    </div>
  );
}
