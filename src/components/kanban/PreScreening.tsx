"use client"

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { StrategicObjectivesService } from "@/api/services/strategic-objectives.service";
import { PreScreeningService } from "@/api/services/preScreening.service";
import { ObjectivesList } from "./prescreening/ObjectivesList";
import { DecisionActions } from "./prescreening/DecisionActions";

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

type Justification = {
  id: string;
  status: string;
  justification: string;
  createdAt: string;
  users: {
    name: string;
    email: string;
  };
};

type ActionMode = "idle" | "reject" | "approve";

export const PreScreening = ({ challengeId, onStatusChange }: CardPreScreeningContentProps) => {
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
      console.log("Response:", response);
      
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
    } catch (error: any) {
      console.error("Erro ao reprovar:", error);
      const errorMsg = error?.response?.data?.message || "Erro ao reprovar desafio.";
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col overflow-y-auto">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-[#0B2B72] dark:text-white mb-2">
          Match Desafio e Objetivos Estratégicos
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Selecione os objetivos alinhados com este desafio e julgue a relevância para o avanço no funil.
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
      />
    </div>
  );
};
