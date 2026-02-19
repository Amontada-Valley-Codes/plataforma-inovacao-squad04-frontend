import { ChevronDown, Plus, Trash2, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import RolloutTimeline from "./GanttChart";
import { ScaleService } from "@/api/services/scale.service";

type Props = {
  challengeId: string
}

type Stakeholder = {
  id: string;
  name: string;
  role: string
};

export default function RolloutPlan({ challengeId }: Props) {
  const [availableStakeholders, setAvailableStakeholders] = useState<Stakeholder[]>([]);
  const [selectedStakeholders, setSelectedStakeholders] = useState<Stakeholder[]>([]);
  const [rolloutScope, setRolloutScope] = useState("");


  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [showGantt, setShowGantt] = useState(false);

  const [executiveSummary, setExecutiveSummary] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [totalCost, setTotalCost] = useState<number | "">("");
  const [benefitValue, setBenefitValue] = useState<number | "">("");
  const [benefitDescription, setBenefitDescription] = useState("");
  const [risks, setRisks] = useState<string[]>([""]);

 const roi = useMemo<number | null>(() => {
    if (totalCost === "" || totalCost === 0 || benefitValue === "") return null;
    return (benefitValue - totalCost) / totalCost;
  }, [totalCost, benefitValue]);


  const roiExplanation = useMemo(() => {
    if (roi === null) return "Informe custos e benefícios para calcular o ROI.";

    if (roi > 0.5)
      return "O retorno é significativamente superior ao custo, indicando forte viabilidade financeira.";

    if (roi > 0)
      return "O retorno supera os custos, porém com margem moderada.";

    if (roi === 0)
      return "O retorno é equivalente ao custo, não gerando ganho financeiro.";

    return "Os custos superam os benefícios, indicando inviabilidade financeira no formato atual.";
  }, [roi]);


  function updateRisk(index: number, value: string) {
    setRisks((prev) => prev.map((r, i) => (i === index ? value : r)));
  }

  function addRisk() {
    setRisks((prev) => [...prev, ""]);
  }  

  function removeRisk(index: number) {
    setRisks((prev) => prev.filter((_, i) => i !== index));
  }

  function addStakeholder() {
    if (!selectedUserId) return;

    const user = availableStakeholders.find(
      (u) => u.id === selectedUserId
    );

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

  const handleCreateScale = async (): Promise<string> => {
    if (totalCost === "" || totalCost < 0)
      throw new Error("Custo inválido");

    if (benefitValue === "" || benefitValue < 0)
      throw new Error("Benefício inválido");

    if (!benefitDescription.trim())
      throw new Error("Descrição obrigatória");

    if (benefitDescription.length > 500)
      throw new Error("Descrição muito longa");

    const filteredRisks = risks.filter((r) => r.trim() !== "");
    if (filteredRisks.length === 0)
      throw new Error("Adicione ao menos um risco");

    const payload = {
      totalCost: Number(totalCost),
      expectedFinancialBenefit: Number(benefitValue),
      benefitDescription: benefitDescription.trim(),
      risksAndMitigations: filteredRisks,
    };

    const response = await ScaleService.createScale(challengeId, payload);

    return response.id; // 👈 agora sempre retorna string
  };

  const handleUpdateExecutiveSummary = async (scaleId: string) => {
    if (!executiveSummary.trim())
      throw new Error("Resumo executivo obrigatório");

    if (executiveSummary.length > 1000)
      throw new Error("Resumo muito longo");

    await ScaleService.updateExecutiveSummary(scaleId, {
      executiveSummary: executiveSummary.trim(),
    });
  };

  const handleCreateRolloutPlan = async (scaleId: string) => {
    if (!rolloutScope.trim()) throw new Error("Escopo obrigatório");
    if (rolloutScope.length > 2000) throw new Error("Escopo muito longo");
    if (selectedStakeholders.length === 0)
      throw new Error("Selecione ao menos um stakeholder");

    const payload = {
      rolloutScope: rolloutScope.trim(),
      stakeholderIds: selectedStakeholders.map((s) => s.id),
    };

    await ScaleService.updateRollOutPlan(scaleId, payload);
  };

const handleSubmit = async () => {
  try {
    setIsSubmitting(true);

    const scaleId = await handleCreateScale();

    console.log(scaleId)

    await handleCreateRolloutPlan(scaleId);

    await handleUpdateExecutiveSummary(scaleId);

    console.log("Processo completo com sucesso 🚀");
  } catch (error) {
    console.error("Erro no submit:", error);
  } finally {
    setIsSubmitting(false);
  }
};

  const [page, setPage] = useState('1')

  const roleTranslate: Record<string, string> = {
    ORGANIZER: "Organizador",
    COLLABORATOR: "Colaborador",
    OBSERVER: "Observador",
    TRANSFORMATION_OFFICE: "Escritório de Transformação",
    INNOVATION_TEAM: "Equipe de Inovação",
    STEERING_COMMITTEE: "Comitê Executivo",
    ADMINISTRATOR: "Administrador",
    MANAGER: "Gestor",
    STARTUP: "Startup",
  };
  
function translateRole(role: string) {
  return roleTranslate[role] ?? role;
}


return (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-[24px] text-[#0B2B70] dark:text-white font-semibold">
        Plano de Rollout
      </h1>

      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center">
          <button
            className={`w-8 h-8 rounded-full font-semibold flex items-center justify-center ${
              page === '1'
                ? "bg-[#0B2B72] text-white"
                : "border-gray-400 border-2 text-gray-500"
            }`}
            onClick={() => setPage('1')}
          >
            1
          </button>
          <span className="text-xs mt-1 whitespace-nowrap">Caso de Negocios</span>
        </div>

        <div className="flex flex-col items-center">
          <button
            className={`w-8 h-8 rounded-full font-semibold flex items-center justify-center ${
              page === '2'
                ? "bg-[#0B2B72] text-white"
                : "border-gray-400 border-2 text-gray-500"
            }`}
            onClick={() => setPage('2')}
          >
            2
          </button>
          <span className="text-xs mt-1 whitespace-nowrap">Plano de Rollout</span>
        </div>
        <div className="flex flex-col items-center">
          <button
            className={`w-8 h-8 rounded-full font-semibold flex items-center justify-center ${
              page === '3'
                ? "bg-[#0B2B72] text-white"
                : "border-gray-400 border-2 text-gray-500"
            }`}
            onClick={() => setPage('3')}
          >
            3
          </button>
          <span className="text-xs mt-1 whitespace-nowrap">Relatorio Final</span>
        </div>
      </div>
    </div>

          {page === "1" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="rounded-xl border p-4 ">
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
              className="w-full rounded-lg bg-[#F9FAFB] border border-white/10 dark:bg-gray-900 text-black/80 dark:text-white  px-3 py-2 text-s outline-none"
            />
          </div>

          <div className="rounded-xl border p-4 ">
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
              className="w-full mb-2 rounded-lg bg-[#F9FAFB] border border-white/10 dark:bg-gray-900 text-black/80 dark:text-white px-3 py-2 text-sm outline-none"
            />

            <textarea
              maxLength={500}
              value={benefitDescription}
              onChange={(e) => setBenefitDescription(e.target.value)}
              placeholder="Descrição dos benefícios"
              className="w-full h-24 resize-none rounded-lg bg-[#F9FAFB] border border-white/10 dark:bg-gray-900 text-black/80 dark:text-white px-3 py-2 text-sm outline-none"
            />

            <div className="text-right text-xs text-white/50">
              {benefitDescription.length}/500
            </div>
          </div>

          <div className="rounded-xl border p-4 md:col-span-2">
            <div className="flex justify-between mb-2">
              <h2 className="text-[#0B2B70] dark:text-white font-semibold">
                ROI Estimado
              </h2>
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
                  className="flex-1 h-24 resize-none rounded-lg bg-[#F9FAFB] border border-white/10 dark:bg-gray-900 text-black/80 dark:text-white px-3 py-2 text-sm outline-none"
                />

                {risks.length > 1 && (
                  <button onClick={() => removeRisk(index)}>
                    <Trash2 size={24} className="p-1 rounded-full transition text-[#0B2B70] dark:text-white hover:text-red-400 hover:bg-white/10" />
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

    {page === '2' && (
      <>
        <div className="flex flex-col mb-6">
          <h1 className="flex gap-1 items-center text-[#0B2B70] dark:text-white font-semibold mb-1">
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
          />
          </div>
        </div>

        <div className="flex flex-col mb-6">
          <h1 className="flex gap-1 items-center text-[#0B2B70] dark:text-white font-semibold mb-1">
            Definir Stakeholders e Responsáveis
          </h1>

          <div className="flex items-center gap-2 rounded-lg border px-3 py-2 bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
            <div className="relative flex-1">
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] dark:bg-black appearance-none cursor-pointer"
              >
                <option value="">Selecionar stakeholders</option>
                {availableStakeholders
                  .filter(user => !selectedStakeholders.some(s => s.id === user.id))
                  .map((stakeholder) => (
                  <option key={stakeholder.id} value={stakeholder.id}>
                    {stakeholder.name} - {translateRole(stakeholder.role)}
                  </option>
                ))}
              </select>

              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-[#0B2B70] pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={addStakeholder}
              className="flex items-center gap-1 px-3 py-2 bg-[#0B2B70] text-white rounded-lg"
            >
              <Plus size={16} />
              Adicionar
            </button>
          </div>

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

  {page === "3" && (
  <div className="grid grid-cols-1 gap-6">

    <div className="rounded-xl border p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[#0B2B70] dark:text-white font-semibold">
          Resumo Executivo Final
        </h2>
      </div>

      <textarea
        required
        maxLength={1000}
        value={executiveSummary}
        onChange={(e) => setExecutiveSummary(e.target.value)}
        placeholder="Descreva a decisão final, justificativa, aprendizados e próximos passos para a escala da solução."
        className="w-full h-48 resize-none rounded-lg px-3 py-2 text-sm bg-[#F9FAFB] border border-white/10 dark:bg-gray-900 text-black/80 dark:text-white outline-none placeholder:text-[#98A2B3]"
      />

      <div className="text-right text-xs text-[#98A2B3] mt-1">
        {executiveSummary.length}/1000
      </div>
    </div>
  </div>
)}
  </div>

  )
}