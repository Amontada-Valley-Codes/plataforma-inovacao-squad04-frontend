"use client"

import { useState, useEffect } from "react";
import { Lightbulb, ChevronUp, ChevronDown } from "lucide-react";
import { StrategicObjectivesService } from "@/api/services/strategic-objectives.service";
import { PreScreeningService } from "@/api/services/preScreening.service";
import { ObjectivesList } from "./prescreening/ObjectivesList";
import { EditObjectiveModal } from "./prescreening/EditObjectiveModal";
import { DeleteObjectiveModal } from "./prescreening/DeleteObjectiveModal";
import { toast } from "sonner";

type ChallengeAdjustmentsProps = {
  challengeId: string;
}

type StrategicObjective = {
  id: string;
  name: string;
  description: string;
};

type Suggestion = {
  id: string;
  status: string;
  justification: string;
  createdAt: string;
  users: {
    name: string;
    email: string;
  };
};

export const ChallengeAdjustments = ({ challengeId }: ChallengeAdjustmentsProps) => {
  const [objectives, setObjectives] = useState<StrategicObjective[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loadingObjectives, setLoadingObjectives] = useState(true);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [selectedObjectives, setSelectedObjectives] = useState<Set<string>>(new Set());
  const [editingObjective, setEditingObjective] = useState<StrategicObjective | null>(null);
  const [deletingObjective, setDeletingObjective] = useState<StrategicObjective | null>(null);

  useEffect(() => {
    loadObjectives();
    loadSuggestions();
  }, [challengeId]);

  const loadObjectives = async () => {
    setLoadingObjectives(true);
    try {
      const response = await StrategicObjectivesService.getObjectivesByChallenge(challengeId);
      
      if (response?.strategicObjective && Array.isArray(response.strategicObjective)) {
        const mappedObjectives = response.strategicObjective
          .filter(item => item?.strategicObjective)
          .map(item => ({
            id: item.strategicObjective.id,
            name: item.strategicObjective.title,
            description: item.strategicObjective.description
          } as StrategicObjective));
        
        setObjectives(mappedObjectives);
      }
    } catch (error) {
      console.error("Erro ao carregar objetivos:", error);
    } finally {
      setLoadingObjectives(false);
    }
  };

  const loadSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const response = await PreScreeningService.getJustifications(challengeId);
      if (response && response.users) {
        setSuggestions([response]);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Erro ao carregar sugestões:", error);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
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

  const handleEditObjective = async (id: string, title: string, description: string) => {
    try {
      await StrategicObjectivesService.UpdateObjective(id, { title, description });
      toast.success("Objetivo estratégico atualizado com sucesso!");
      loadObjectives();
      setEditingObjective(null);
    } catch (error) {
      console.error("Erro ao atualizar objetivo:", error);
      toast.error("Erro ao atualizar objetivo estratégico.");
    }
  };

  const handleDeleteObjective = () => {
    toast.info("Função de deletar ainda não implementada.");
    setDeletingObjective(null);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Revise e ajuste os objetivos estratégicos vinculados a este desafio e visualize as sugestões de melhoria.
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
          showActions={true}
          onEdit={setEditingObjective}
          onDelete={setDeletingObjective}
        />
      )}

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <button 
          onClick={() => setShowSuggestions(!showSuggestions)} 
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-2">
            <Lightbulb size={14} className="text-yellow-600 dark:text-yellow-500" />
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Sugestões de Ajustes ({suggestions.length})
            </h4>
          </div>
          {showSuggestions ? (
            <ChevronUp size={14} className="text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronDown size={14} className="text-gray-600 dark:text-gray-400" />
          )}
        </button>

        {showSuggestions && (
          <div className="mt-2 space-y-2">
            {loadingSuggestions ? (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm py-3">
                <div className="w-3 h-3 border-2 border-[#0B2B72]/30 border-t-[#0B2B72] rounded-full animate-spin" />
                Carregando sugestões...
              </div>
            ) : suggestions.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400 py-2">
                Nenhuma sugestão disponível.
              </p>
            ) : (
              suggestions.map((s) => {
                if (!s.users || !s.users.name) return null;
                
                return (
                <div 
                  key={s.id} 
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          s.status === 'DISAPPROVE' 
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {s.status === 'DISAPPROVE' ? 'Reprovado' : 'Ajustes Solicitados'}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {s.users.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                        {s.justification}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {new Date(s.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {editingObjective && (
        <EditObjectiveModal
          objective={editingObjective}
          onClose={() => setEditingObjective(null)}
          onSave={handleEditObjective}
        />
      )}

      {deletingObjective && (
        <DeleteObjectiveModal
          objective={deletingObjective}
          onClose={() => setDeletingObjective(null)}
          onConfirm={handleDeleteObjective}
        />
      )}
    </div>
  );
};
