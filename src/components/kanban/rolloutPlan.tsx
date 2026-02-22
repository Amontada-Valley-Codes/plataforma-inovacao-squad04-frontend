import { Plus, Trash2, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import RolloutTimeline from "./GanttChart";
import { ScaleService } from "@/api/services/scale.service";
import { CardContentsHeader } from "./CardsContents";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type Props = {
  challengeId: string;
  challengeTitle: string;
  visibility: string;
  creator: string;
  startDate: string;
  category: string;
};

type Stakeholder = {
  id: string;
  name: string;
  role: string;
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const roleTranslate: Record<string, string> = {
  ORGANIZER:              "Organizador",
  COLLABORATOR:           "Colaborador",
  OBSERVER:               "Observador",
  TRANSFORMATION_OFFICE:  "Escritório de Transformação",
  INNOVATION_TEAM:        "Equipe de Inovação",
  STEERING_COMMITTEE:     "Comitê Executivo",
  ADMINISTRATOR:          "Administrador",
  MANAGER:                "Gestor",
  STARTUP:                "Startup",
};

function translateRole(role: string) {
  return roleTranslate[role] ?? role;
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export default function RolloutPlan({
  challengeId,
  challengeTitle,
  creator,
  category,
  startDate,
  visibility,
}: Props) {
  // ── State ──────────────────────────────────

  const [page, setPage] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGantt, setShowGantt] = useState(false);

  // Caso de Negócios
  const [totalCost, setTotalCost] = useState<number | "">("");
  const [benefitValue, setBenefitValue] = useState<number | "">("");
  const [benefitDescription, setBenefitDescription] = useState("");
  const [risks, setRisks] = useState<string[]>([""]);

  // Plano de Rollout
  const [rolloutScope, setRolloutScope] = useState("");
  const [availableStakeholders, setAvailableStakeholders] = useState<Stakeholder[]>([]);
  const [selectedStakeholders, setSelectedStakeholders] = useState<Stakeholder[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  // Relatório Final
  const [executiveSummary, setExecutiveSummary] = useState("");

  // ── ROI ────────────────────────────────────

  const roi = useMemo<number | null>(() => {
    if (totalCost === "" || totalCost === 0 || benefitValue === "") return null;
    return (benefitValue - totalCost) / totalCost;
  }, [totalCost, benefitValue]);

  const roiExplanation = useMemo(() => {
    if (roi === null) return "Informe custos e benefícios para calcular o ROI.";
    if (roi > 0.5)  return "O retorno é significativamente superior ao custo, indicando forte viabilidade financeira.";
    if (roi > 0)    return "O retorno supera os custos, porém com margem moderada.";
    if (roi === 0)  return "O retorno é equivalente ao custo, não gerando ganho financeiro.";
    return "Os custos superam os benefícios, indicando inviabilidade financeira no formato atual.";
  }, [roi]);

  // ── Risks ──────────────────────────────────

  function updateRisk(index: number, value: string) {
    setRisks((prev) => prev.map((r, i) => (i === index ? value : r)));
  }

  function addRisk() {
    setRisks((prev) => [...prev, ""]);
  }

  function removeRisk(index: number) {
    setRisks((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Stakeholders ───────────────────────────

  function addStakeholder() {
    if (!selectedUserId) return;
    const user = availableStakeholders.find((u) => u.id === selectedUserId);
    if (!user) return;
    setSelectedStakeholders((prev) => [...prev, user]);
    setSelectedUserId("");
  }

  const fetchStakeholders = async () => {
    try {
      const response = await ScaleService.getStakeholders(challengeId);
      const formatted: Stakeholder[] = response.map((item: any) => ({
        id: item.user.id,
        name: item.user.name,
        role: item.user.type_user,
      }));
      setAvailableStakeholders(formatted);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!challengeId) return;
    fetchStakeholders();
  }, [challengeId]);

  // ── Submit handlers ────────────────────────

  const handleCreateScale = async (): Promise<string> => {
    if (totalCost === "" || totalCost < 0)         throw new Error("Custo inválido");
    if (benefitValue === "" || benefitValue < 0)   throw new Error("Benefício inválido");
    if (!benefitDescription.trim())                throw new Error("Descrição obrigatória");
    if (benefitDescription.length > 500)           throw new Error("Descrição muito longa");

    const filteredRisks = risks.filter((r) => r.trim() !== "");
    if (filteredRisks.length === 0) throw new Error("Adicione ao menos um risco");

    const response = await ScaleService.createScale(challengeId, {
      totalCost: Number(totalCost),
      expectedFinancialBenefit: Number(benefitValue),
      benefitDescription: benefitDescription.trim(),
      risksAndMitigations: filteredRisks,
    });

    return response.id;
  };

  const handleUpdateExecutiveSummary = async (scaleId: string) => {
    if (!executiveSummary.trim())         throw new Error("Resumo executivo obrigatório");
    if (executiveSummary.length > 1000)   throw new Error("Resumo muito longo");

    await ScaleService.updateExecutiveSummary(scaleId, {
      executiveSummary: executiveSummary.trim(),
    });
  };

  const handleCreateRolloutPlan = async (scaleId: string) => {
    if (!rolloutScope.trim())               throw new Error("Escopo obrigatório");
    if (rolloutScope.length > 2000)         throw new Error("Escopo muito longo");
    if (selectedStakeholders.length === 0)  throw new Error("Selecione ao menos um stakeholder");

    await ScaleService.updateRollOutPlan(scaleId, {
      rolloutScope: rolloutScope.trim(),
      stakeholderIds: selectedStakeholders.map((s) => s.id),
    });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const scaleId = await handleCreateScale();
      await handleCreateRolloutPlan(scaleId);
      await handleUpdateExecutiveSummary(scaleId);
      console.log("Processo completo com sucesso 🚀");
    } catch (error) {
      console.error("Erro no submit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Shared styles ──────────────────────────

  const inputBase = `
    w-full rounded-lg bg-[#F9FAFB] border border-white/10
    dark:bg-gray-900 text-black/80 dark:text-white
    px-3 py-2 text-sm outline-none
    placeholder:text-[#98A2B3]
  `;

  // ── Stepper ────────────────────────────────

  const steps = [
    { id: '1', label: 'Caso de Negócios' },
    { id: '2', label: 'Plano de Rollout' },
    { id: '3', label: 'Relatório Final' },
  ];

  // ── Render ─────────────────────────────────

  return (
    <div>
      {/* Header + Stepper */}
      <div className="flex flex-col xl:flex-row xl:justify-between mb-6">
        <CardContentsHeader
          challengeTitle={challengeTitle}
          category={category}
          startDate={startDate}
          creator={creator}
          visibility={visibility}
        />
        <div className="relative flex items-center">
          <div className="flex gap-8 xl:gap-4 items-start xl:justify-center w-full max-w-md">
            <div className="flex flex-col items-center">
              <button
                className={`w-8 h-8 rounded-full font-semibold flex items-center justify-center ${page === '1' ? "bg-[#0B2B72] text-white" : "border-gray-400 border-2 text-gray-500"
                  }`}
                onClick={() => setPage('1')}
              >
                1
              </button>
              <span className="text-sm mt-1 text-center flex flex-col leading-tight">
                <span className="mt-0.5">Casos</span>
                <span>de</span>
                <span>Negócios</span>
              </span>
            </div>

            <div className="flex flex-col items-center">

              <button
                className={`w-8 h-8 rounded-full font-semibold flex items-center justify-center ${page === '2'
                    ? "bg-[#0B2B72] text-white"
                    : "border-gray-400 border-2 text-gray-500"
                  }`}
                onClick={() => setPage('2')}
              >
                2
              </button>
              <span className="text-sm mt-1 text-center flex flex-col leading-tight">
                <span className="mt-0.5">Plano</span>
                <span>de</span>
                <span>Rollout</span>
              </span>
            </div>


            <div className="flex flex-col items-center">
              <button
                className={`w-8 h-8 rounded-full  font-semibold flex items-center justify-center ${page === '3' ? "bg-[#0B2B72] text-white" : "border-gray-400 dark:placeholder:text-white border-2 text-gray-500"
                  }`}
                onClick={() => setPage('3')}
              >
                3
              </button>
              <span className="text-sm mt-1 text-center flex flex-col leading-tight">
                <span className="mt-0.5">Relatório</span>
                <span>Final</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <h1 className="text-[24px] text-[#0B2B70] dark:text-white font-semibold mb-4">
        Plano de Rollout
      </h1>

      {/* ── Page 1: Caso de Negócios ─────────── */}
      {page === "1" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Custo Total */}
          <div className="rounded-xl border p-4">
            <div className="flex justify-between mb-3">
              <h2 className="text-[#0B2B70] dark:text-white font-semibold">Custo Total</h2>
              <DollarSign size={18} className="text-[#0B2B70] dark:text-white" />
            </div>
            <input
              type="number"
              min={0}
              required
              value={totalCost}
              onChange={(e) => setTotalCost(Number(e.target.value))}
              placeholder="R$ 0,00"
              className={inputBase}
            />
          </div>

          {/* Benefícios Esperados */}
          <div className="rounded-xl border p-4">
            <div className="flex justify-between mb-3">
              <h2 className="text-[#0B2B70] dark:text-white font-semibold">Benefícios Esperados</h2>
              <TrendingUp size={18} className="text-[#0B2B70] dark:text-white" />
            </div>
            <input
              type="number"
              min={0}
              value={benefitValue}
              onChange={(e) => setBenefitValue(Number(e.target.value))}
              placeholder="Valor financeiro"
              className={`${inputBase} mb-2`}
            />
            <textarea
              maxLength={500}
              value={benefitDescription}
              onChange={(e) => setBenefitDescription(e.target.value)}
              placeholder="Descrição dos benefícios"
              className={`${inputBase} h-24 resize-none`}
            />
            <div className="text-right text-xs text-[#98A2B3] mt-1">
              {benefitDescription.length}/500
            </div>
          </div>

          {/* ROI */}
          <div className="rounded-xl border p-4 md:col-span-2">
            <div className="flex justify-between mb-2">
              <h2 className="text-[#0B2B70] dark:text-white font-semibold">ROI Estimado</h2>
              <TrendingUp size={18} className="text-[#0B2B70] dark:text-white" />
            </div>
            <div className="text-xl font-semibold text-[#0B2B70] dark:text-white">
              {roi !== null ? `${(roi * 100).toFixed(2)}%` : "0%"}
            </div>
            <p className="text-xs text-[#98A2B3] mt-1">
              Fórmula: (Benefícios − Custos) ÷ Custos
            </p>
            {roi !== null && (
              <p className="text-xs text-[#667085] mt-1">
                Cálculo: ({benefitValue} − {totalCost}) ÷ {totalCost}
              </p>
            )}
            <div className="mt-3 rounded-md bg-[#F9FAFB] dark:bg-gray-900 p-3 text-sm text-[#344054] dark:text-[#ced3db]">
              {roiExplanation}
            </div>
          </div>

          {/* Riscos */}
          <div className="rounded-xl border p-4 md:col-span-2">
            <div className="flex justify-between mb-3">
              <h2 className="text-[#0B2B70] dark:text-white font-semibold">Riscos e Mitigadores</h2>
              <AlertTriangle size={18} className="text-[#0B2B70] dark:text-white" />
            </div>

            {risks.map((risk, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <textarea
                  required
                  maxLength={1500}
                  value={risk}
                  onChange={(e) => updateRisk(index, e.target.value)}
                  placeholder="Descreva o risco e mitigação"
                  className={`${inputBase} flex-1 h-24 resize-none`}
                />
                {risks.length > 1 && (
                  <button onClick={() => removeRisk(index)}>
                    <Trash2
                      size={24}
                      className="p-1 rounded-full transition text-[#0B2B70] dark:text-white hover:text-red-400 hover:bg-white/10"
                    />
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addRisk}
              className="flex items-center gap-1 text-sm text-[#0B2B70] dark:text-white"
            >
              <Plus size={14} /> Adicionar risco
            </button>

            <div className="flex justify-end mt-8">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#0B2B70] text-white rounded-lg disabled:opacity-50"
              >
                {isSubmitting ? "Salvando..." : "Finalizar Plano"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page 2: Plano de Rollout ─────────── */}
      {page === '2' && (
        <>
          {/* Escopo */}
          <div className="flex flex-col mb-6">
            <h1 className="text-[#0B2B70] dark:text-white font-semibold mb-1">
              Escopo Detalhado
            </h1>
            <div className="flex rounded-lg border px-3 py-2 bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
              <textarea
                required
                rows={5}
                maxLength={2000}
                value={rolloutScope}
                onChange={(e) => setRolloutScope(e.target.value)}
                placeholder="Descreva o escopo detalhado"
                className="w-full bg-transparent text-sm outline-none text-black/80 dark:text-white placeholder:text-[#98A2B3] resize-none"
              />
            </div>
          </div>

          {/* Stakeholders */}
          <div className="flex flex-col mb-6">
            <h1 className="text-[#0B2B70] dark:text-white font-semibold mb-1">
              Definir Stakeholders e Responsáveis
            </h1>

            <div className="flex items-center gap-2">
              {/* ── Radix Select para stakeholder ── */}
              <Select
                value={selectedUserId || "none"}
                onValueChange={(val) => setSelectedUserId(val === "none" ? "" : val)}
              >
                <SelectTrigger className="flex-1 h-10 bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900 text-sm text-[#344054] dark:text-[#ced3db]">
                  <SelectValue placeholder="Selecionar stakeholders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Selecionar stakeholders</SelectItem>
                  {availableStakeholders
                    .filter((user) => !selectedStakeholders.some((s) => s.id === user.id))
                    .map((stakeholder) => (
                      <SelectItem key={stakeholder.id} value={stakeholder.id}>
                        {stakeholder.name} — {translateRole(stakeholder.role)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <button
                type="button"
                onClick={addStakeholder}
                className="flex items-center gap-1 px-3 py-2 bg-[#0B2B70] text-white rounded-lg whitespace-nowrap"
              >
                <Plus size={16} />
                Adicionar
              </button>
            </div>

            {/* Tags dos stakeholders selecionados */}
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedStakeholders.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-[#E7EEFF] text-[#0B2B70]"
                >
                  {item.name}
                  <span className="text-xs opacity-70">({translateRole(item.role)})</span>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedStakeholders((prev) =>
                        prev.filter((s) => s.id !== item.id)
                      )
                    }
                    className="hover:text-red-400 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowGantt(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#0B2B70] text-white rounded-lg hover:bg-[#0a245e] transition"
              >
                Ver cronograma (Gantt)
              </button>
            </div>
          </div>

          {/* Modal Gantt */}
          {showGantt && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
              <div className="w-[90vw] max-w-6xl max-h-[90vh] overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-lg flex flex-col">
                <div className="flex items-center justify-between mb-4 p-2">
                  <h2 className="text-lg font-semibold text-[#0B2B70] dark:text-white">
                    Cronograma de Rollout
                  </h2>
                  <button
                    onClick={() => setShowGantt(false)}
                    className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex-1 overflow-auto">
                  <RolloutTimeline />
                </div>
                <div className="flex justify-end mt-4 p-2">
                  <button
                    onClick={() => setShowGantt(false)}
                    className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Page 3: Relatório Final ──────────── */}
      {page === "3" && (
        <div className="grid grid-cols-1 gap-6">
          <div className="rounded-xl border p-4">
            <h2 className="text-[#0B2B70] dark:text-white font-semibold mb-3">
              Resumo Executivo Final
            </h2>
            <textarea
              required
              maxLength={1000}
              value={executiveSummary}
              onChange={(e) => setExecutiveSummary(e.target.value)}
              placeholder="Descreva a decisão final, justificativa, aprendizados e próximos passos para a escala da solução."
              className={`${inputBase} h-48 resize-none`}
            />
            <div className="text-right text-xs text-[#98A2B3] mt-1">
              {executiveSummary.length}/1000
            </div>
          </div>
        </div>
      )}
    </div>
  );
}