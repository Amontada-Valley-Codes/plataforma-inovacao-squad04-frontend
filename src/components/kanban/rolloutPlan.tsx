import { ChevronDown, Plus, Trash2, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import { useMemo, useState } from "react";
import RolloutTimeline from "./GanttChart";

type Stakeholder = {
  id: string;
  name: string;
  role: "RESPONSAVEL" | "APOIO" | "APROVADOR";
};

export default function RolloutPlan() {
  const [isOpen, setIsOpen] = useState(false);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [showGantt, setShowGantt] = useState(false);


  const [cost, setCost] = useState<number | "">("");
  const [benefitValue, setBenefitValue] = useState<number | "">("");
  const [benefitDescription, setBenefitDescription] = useState("");
  const [risks, setRisks] = useState<string[]>([""]);

  const roi = useMemo(() => {
    if (cost === "" || cost === 0 || benefitValue === "") return null;
    return ((benefitValue - cost) / cost).toFixed(2);
  }, [cost, benefitValue]);

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

    if (stakeholders.length >= 20) {
      alert("Limite máximo de 20 stakeholders");
      return;
    }

    const user = users.find((u) => u.id === selectedUserId);
    if (!user) return;

    const alreadyAdded = stakeholders.some(
      (s) => s.id === user.id
    );
    if (alreadyAdded) return;

    setStakeholders((prev) => [...prev, user]);
  }

  const users: Stakeholder[] = [
    { id: "1", name: "João", role: "RESPONSAVEL" },
    { id: "2", name: "Maria", role: "APOIO" },
    { id: "3", name: "Ana", role: "APROVADOR" },
  ];

  const [page, setPage] = useState('1')

  
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
          <span className="text-xs mt-1 whitespace-nowrap">Page 1</span>
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
          <span className="text-xs mt-1 whitespace-nowrap">Page 2</span>
        </div>
      </div>
    </div>

          {page === "1" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Custo */}
          <div className="rounded-xl border border-white/20 p-4 bg-black/30">
            <div className="flex justify-between mb-3">
              <h2 className="text-white font-semibold">Custo Total</h2>
              <DollarSign size={18} className="text-white/70" />
            </div>

            <input
              type="number"
              min={0}
              required
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              placeholder="R$ 0,00"
              className="w-full rounded-lg bg-black/40 border border-white/20 px-3 py-2 text-sm text-white outline-none"
            />
          </div>

          {/* Benefícios */}
          <div className="rounded-xl border border-white/20 p-4 bg-black/30">
            <div className="flex justify-between mb-3">
              <h2 className="text-white font-semibold">Benefícios Esperados</h2>
              <TrendingUp size={18} className="text-white/70" />
            </div>

            <input
              type="number"
              min={0}
              value={benefitValue}
              onChange={(e) => setBenefitValue(Number(e.target.value))}
              placeholder="Valor financeiro"
              className="w-full mb-2 rounded-lg bg-black/40 border border-white/20 px-3 py-2 text-sm text-white outline-none"
            />

            <textarea
              maxLength={500}
              value={benefitDescription}
              onChange={(e) => setBenefitDescription(e.target.value)}
              placeholder="Descrição dos benefícios"
              className="w-full h-24 resize-none rounded-lg bg-black/40 border border-white/20 px-3 py-2 text-sm text-white outline-none"
            />

            <div className="text-right text-xs text-white/50">
              {benefitDescription.length}/500
            </div>
          </div>

          <div className="rounded-xl border border-white/20 p-4 bg-black/30 md:col-span-2">
            <div className="flex justify-between mb-2">
              <h2 className="text-white font-semibold">ROI Estimado</h2>
              <TrendingUp size={18} className="text-white/70" />
            </div>

            <div className="text-xl font-semibold text-white">
              {roi !== null ? `${roi} R$` : "0 R$"}
            </div>


            <p className="text-xs text-white/60 mt-1">
              (Benefícios – Custos) / Custos
            </p>
          </div>

          <div className="rounded-xl border border-white/20 p-4 bg-black/30 md:col-span-2">
            <div className="flex justify-between mb-3">
              <h2 className="text-white font-semibold">Riscos e Mitigadores</h2>
              <AlertTriangle size={18} className="text-white/70" />
            </div>

            {risks.map((risk, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <textarea
                  required
                  maxLength={1500}
                  value={risk}
                  onChange={(e) => updateRisk(index, e.target.value)}
                  placeholder="Descreva o risco e mitigação"
                  className="flex-1 h-24 resize-none rounded-lg bg-black/40 border border-white/20 px-3 py-2 text-sm text-white outline-none"
                />

                {risks.length > 1 && (
                  <button onClick={() => removeRisk(index)}>
                    <Trash2 size={24} className="p-1 rounded-full transition text-white/60 hover:text-red-400 hover:bg-white/10" />
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addRisk}
              className="flex items-center gap-1 text-sm text-white/80"
            >
              <Plus size={14} /> Adicionar risco
            </button>
          </div>
        </div>
      )}

    {page === '2' && (
      <>
        <div className="flex flex-col mb-4">
          <h1 className="flex gap-1 items-center text-black dark:text-white text-lg mb-1">
            Escopo Detalhado
          </h1>

          <div className="flex-1 flex items-center rounded-lg border px-3 py-2 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
            <textarea
              required
              rows={5}
              maxLength={2000}
              placeholder="Descreva o escopo detalhado"
              className="w-full resize-none bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3] dark:placeholder:text-white"
            />
          </div>
        </div>

        <div className="flex flex-col mb-4">
          <h1 className="flex gap-1 items-center text-black dark:text-white text-lg mb-1">
            Definir Stakeholders e Responsáveis
          </h1>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors text-[#0B2B70] font-semibold text-[14px] rounded-[8px] relative">
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="flex w-50 justify-center p-2 appearance-none cursor-pointer rounded-[8px] outline-none"
              >
                <option value="">Selecionar stakeholders</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>

              <ChevronDown
                className={`text-[#0B2B70] absolute right-2 pointer-events-none transition-transform duration-200 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              />
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
            {stakeholders.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 bg-[#E7EEFF] text-[#0B2B70] px-3 py-1 rounded-full text-sm font-medium"
              >
                {item.name}
                <span className="text-xs opacity-70">({item.role})</span>

                <button
                  type="button"
                  onClick={() =>
                    setStakeholders((prev) =>
                      prev.filter((s) => s.id !== item.id)
                    )
                  }
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setShowGantt(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0B2B70] text-white rounded-lg hover:bg-[#0a245e] transition"
            >
              Ver cronograma (Gantt)
            </button>
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
        </div>
      </>
    )}
  </div>
  )
}