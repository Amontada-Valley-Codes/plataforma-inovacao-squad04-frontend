"use client"

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { StrategicObjectivesService } from "@/api/services/strategic-objectives.service";
import { PreScreeningService } from "@/api/services/preScreening.service";
import { ChallengeService } from "@/api/services/challenge.service";
import { ObjectivesList } from "./prescreening/ObjectivesList";
import { DecisionActions } from "./prescreening/DecisionActions";
import { CardContentsHeader } from "./CardsContents";

type CardPreScreeningContentProps = {
  challangeTitle: string;
  challengeId: string;
  category: string;
  strategicAlignment: string | null;
  innovativePotential: string | null;
  businessRelevance: string | null;
  startDate: string;
  creator: string;
  onStatusChange?: () => void;
}

type StrategicObjective = {
  id: string;
  name: string;
  description: string;
};

type ActionMode = "idle" | "reject" | "approve" | "requestChanges";

export const PreScreening = ({ challangeTitle, challengeId, category, startDate, creator, onStatusChange }: CardPreScreeningContentProps) => {
  const [actionMode, setActionMode] = useState<ActionMode>("idle");
  const [justification, setJustification] = useState("");
  const [alignmentJustification, setAlignmentJustification] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedObjectives, setSelectedObjectives] = useState<Set<string>>(new Set());
  const [strategicRelevance, setStrategicRelevance] = useState<"HIGH" | "MEDIUM" | "LOW">("HIGH");
  const [loading, setLoading] = useState(false);
  const [objectives, setObjectives] = useState<StrategicObjective[]>([]);
  const [loadingObjectives, setLoadingObjectives] = useState(true);

  useEffect(() => {
    loadObjectives();
  }, [challengeId]);

  const loadObjectives = async () => {
    setLoadingObjectives(true);
    try {
      const response = await StrategicObjectivesService.getObjectivesByChallenge(challengeId);
      
      if (response?.strategicObjective && Array.isArray(response.strategicObjective) && response.strategicObjective.length > 0) {
        const mappedObjectives = response.strategicObjective
          .filter(item => item?.strategicObjective)
          .map(item => ({
            id: item.strategicObjective.id,
            name: item.strategicObjective.title,
            description: item.strategicObjective.description
          } as StrategicObjective));
        
        setObjectives(mappedObjectives);
      } else {
        setObjectives([]);
      }
    } catch (error) {
      console.error("Erro ao carregar objetivos:", error);
      setObjectives([]);
    } finally {
      setLoadingObjectives(false);
    }
  };

  const toggleObjective = (id: string) => {
    setSelectedObjectives((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleApprove = async () => {
    if (!alignmentJustification.trim()) {
      toast.error("Por favor, preencha a justificativa de alinhamento.");
      return;
    }
    setLoading(true);
    try {
      await PreScreeningService.createPreScreening(challengeId, {
        alignmentJustification,
        strategicRelevance,
        notes: notes.trim() || undefined
      });
      toast.success("Desafio aprovado e avançado para Triagem Detalhada!");
      setActionMode("idle");
      setAlignmentJustification("");
      setNotes("");
    } catch (error) {
      console.error("Erro ao aprovar:", error);
      toast.error("Erro ao aprovar desafio.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!justification.trim()) {
      toast.error("Justificativa é obrigatória para rejeição.");
      return;
    }
    setLoading(true);
    try {
      await PreScreeningService.registerDecision(challengeId, {
        decision: "DISAPPROVE",
        justification
      });
      toast.success("Desafio reprovado com sucesso!");
      onStatusChange?.();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error("Erro ao reprovar:", error);
      const errorMsg = error?.response?.data?.message || "Erro ao reprovar desafio.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!justification.trim()) {
      toast.error("Justificativa é obrigatória para solicitar ajustes.");
      return;
    }
    setLoading(true);
    try {
      await PreScreeningService.registerDecision(challengeId, {
        decision: "CHANGES_REQUESTED",
        justification
      });
      toast.success("Ajustes solicitados! Desafio retornou para Geração.");
      onStatusChange?.();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error("Erro ao solicitar ajustes:", error);
      const errorMsg = error?.response?.data?.message || "Erro ao solicitar ajustes.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToBacklog = async () => {
    setLoading(true);
    try {
      await ChallengeService.changeStatus(challengeId, {
        status: "FUTURE_BACKLOG"
      });
      toast.success("Desafio movido para o backlog com sucesso!");
      onStatusChange?.();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error("Erro ao mover para backlog:", error);
      const errorMsg = error?.response?.data?.message || "Erro ao mover para backlog.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col overflow-y-auto">
      <CardContentsHeader
        challengeTitle={challangeTitle}
        category={category}
        startDate={startDate}
        creator={creator}
      />

      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Avalie o alinhamento deste desafio com os objetivos estratégicos da organização e defina a relevância para prosseguir no funil de inovação.
        </p>
      </div>

      {loadingObjectives ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-[#0B2B72]/30 border-t-[#0B2B72] rounded-full animate-spin" />
        </div>
      ) : (
        <ObjectivesList
          objectives={objectives}
          selectedObjectives={selectedObjectives}
          onToggleObjective={toggleObjective}
          showActions={false}
        />
      )}

      <DecisionActions
        actionMode={actionMode}
        justification={justification}
        alignmentJustification={alignmentJustification}
        notes={notes}
        strategicRelevance={strategicRelevance}
        loading={loading}
        onActionModeChange={setActionMode}
        onJustificationChange={setJustification}
        onAlignmentJustificationChange={setAlignmentJustification}
        onNotesChange={setNotes}
        onStrategicRelevanceChange={setStrategicRelevance}
        onApprove={handleApprove}
        onReject={handleReject}
        onRequestChanges={handleRequestChanges}
        onMoveToBacklog={handleMoveToBacklog}
      />
    </div>
  );
};
