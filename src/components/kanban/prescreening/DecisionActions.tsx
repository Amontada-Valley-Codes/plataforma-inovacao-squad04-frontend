import { CheckCircle, XCircle, AlertCircle, Archive } from "lucide-react";
import { cn } from "@/lib/utils";

type ActionMode = "idle" | "reject" | "approve" | "requestChanges";

type DecisionActionsProps = {
  actionMode: ActionMode;
  justification: string;
  alignmentJustification: string;
  notes: string;
  strategicRelevance: "HIGH" | "MEDIUM" | "LOW";
  loading: boolean;
  onActionModeChange: (mode: ActionMode) => void;
  onJustificationChange: (value: string) => void;
  onAlignmentJustificationChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onStrategicRelevanceChange: (value: "HIGH" | "MEDIUM" | "LOW") => void;
  onApprove: () => void;
  onReject: () => void;
  onRequestChanges: () => void;
  onMoveToBacklog: () => void;
};

const relevanceOptions: { value: "HIGH" | "MEDIUM" | "LOW"; label: string; color: string }[] = [
  { value: "HIGH", label: "Alta", color: "border-[#15409c]/30 bg-[#15409c]/10 text-[#15409c] data-[active=true]:bg-[#15409c] data-[active=true]:text-white dark:bg-[#15409c]/20 dark:text-[#15409c] dark:border-[#15409c]/40" },
  { value: "MEDIUM", label: "Média", color: "border-[#15409c]/30 bg-[#15409c]/10 text-[#15409c] data-[active=true]:bg-[#15409c] data-[active=true]:text-white dark:bg-[#15409c]/20 dark:text-[#15409c] dark:border-[#15409c]/40" },
  { value: "LOW", label: "Baixa", color: "border-[#15409c]/30 bg-[#15409c]/10 text-[#15409c] data-[active=true]:bg-[#15409c] data-[active=true]:text-white dark:bg-[#15409c]/20 dark:text-[#15409c] dark:border-[#15409c]/40" },
];

export const DecisionActions = ({
  actionMode,
  justification,
  alignmentJustification,
  notes,
  strategicRelevance,
  loading,
  onActionModeChange,
  onJustificationChange,
  onAlignmentJustificationChange,
  onNotesChange,
  onStrategicRelevanceChange,
  onApprove,
  onReject,
  onRequestChanges,
  onMoveToBacklog,
}: DecisionActionsProps) => {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
      <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
        Decisão do Gestor
      </h4>

      {actionMode === "approve" && (
        <div className="mb-3 space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-900 dark:text-white mb-1.5 block">
              Justificativa de Alinhamento <span className="text-red-600">*</span>
            </label>
            <textarea
              value={alignmentJustification}
              onChange={(e) => onAlignmentJustificationChange(e.target.value)}
              placeholder="Descreva como este desafio está alinhado ao plano estratégico..."
              className="w-full text-sm border border-gray-300 dark:border-gray-700 rounded-xl p-3 resize-none h-20 focus:outline-none focus:ring-2 focus:ring-[#0B2B72]/30 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-900 dark:text-white mb-1.5 block">
              Relevância Estratégica <span className="text-red-600">*</span>
            </label>
            <div className="flex gap-2">
              {relevanceOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  data-active={strategicRelevance === opt.value}
                  onClick={() => onStrategicRelevanceChange(opt.value)}
                  className={cn("flex-1 py-2 rounded-lg text-xs font-bold border transition-all", opt.color)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-900 dark:text-white mb-1.5 block">
              Observações Adicionais
            </label>
            <textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Observações sobre a pré-triagem (opcional, máx. 800 caracteres)..."
              maxLength={800}
              className="w-full text-sm border border-gray-300 dark:border-gray-700 rounded-xl p-3 resize-none h-20 focus:outline-none focus:ring-2 focus:ring-[#0B2B72]/30 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notes.length}/800</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onApprove}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#0B2B72] text-white text-sm font-semibold hover:bg-[#09245e] transition-colors disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CheckCircle size={15} />
              )}
              Salvar Match
            </button>
            <button
              onClick={() => onActionModeChange("idle")}
              className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

{actionMode === "reject" && (
        <div className="mb-3 space-y-2">
          <label className="text-xs font-medium text-gray-900 dark:text-white">
            Justificativa da rejeição <span className="text-red-600">*</span>
          </label>
          <textarea
            value={justification}
            onChange={(e) => onJustificationChange(e.target.value)}
            placeholder="Explique os motivos da rejeição deste desafio..."
            maxLength={1000}
            className="w-full text-sm border border-red-400 rounded-xl p-3 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-red-400/30 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">{justification.length}/1000</p>
          <div className="flex gap-2">
            <button
              onClick={onReject}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <XCircle size={15} />
              )}
              Reprovar Desafio
            </button>
            <button
              onClick={() => onActionModeChange("idle")}
              className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {actionMode === "requestChanges" && (
        <div className="mb-3 space-y-2">
          <label className="text-xs font-medium text-gray-900 dark:text-white">
            Justificativa dos ajustes solicitados <span className="text-red-600">*</span>
          </label>
          <textarea
            value={justification}
            onChange={(e) => onJustificationChange(e.target.value)}
            placeholder="Descreva os ajustes necessários para este desafio..."
            maxLength={1000}
            className="w-full text-sm border border-yellow-400 rounded-xl p-3 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">{justification.length}/1000</p>
          <div className="flex gap-2">
            <button
              onClick={onRequestChanges}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-yellow-600 text-white text-sm font-semibold hover:bg-yellow-700 transition-colors disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <AlertCircle size={15} />
              )}
              Solicitar Ajustes
            </button>
            <button
              onClick={() => onActionModeChange("idle")}
              className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {actionMode === "idle" && (
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => onActionModeChange("approve")}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B2B72] text-white text-sm font-semibold hover:bg-[#09245e] transition-all shadow-sm hover:shadow-md"
          >
            <CheckCircle size={15} />
            Fazer Match do Desafio
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onActionModeChange("reject");
                onJustificationChange("");
              }}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <XCircle size={14} />
              Reprovar Desafio
            </button>
            <button
              onClick={() => {
                onActionModeChange("requestChanges");
                onJustificationChange("");
              }}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-sm font-medium hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
            >
              <AlertCircle size={14} />
              Solicitar Ajustes
            </button>
          </div>
          <button
            onClick={onMoveToBacklog}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-gray-400 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-400 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-60"
          >
            <Archive size={14} />
            Mover para Backlog
          </button>
        </div>
      )}
    </div>
  );
};
