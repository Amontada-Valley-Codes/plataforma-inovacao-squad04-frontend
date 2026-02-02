import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
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
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[24px] text-[#0B2B70] dark:text-white font-semibold mb-4">
          Plano de Rollout
        </h1>
      </div>

      <div className="flex flex-col mb-4">
        <h1 className="flex gap-1 items-center text-black dark:text-white text-lg mb-1">
          Escopo Detalhado
        </h1>

        <div className="flex-1 flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
          <textarea  
            required
            rows={5}
            maxLength={2000} 
            placeholder="Descreva o escopo detalhado"
            className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3] dark:placeholder:text-white"
          />
        </div>
      </div>

      <div className="flex flex-col mb-4">
        <h1 className="flex gap-1 items-center text-black dark:text-white text-lg mb-1">
          Definir Stakeholders e Responsáveis 
        </h1>

        <div className="flex items-center gap-2">
          <div 
            className="flex items-center bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors
            text-[#0B2B70] font-semibold text-[14px] rounded-[8px] relative"
          >
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
              className={`text-[#0B2B70] absolute right-2 pointer-events-none
              transition-transform duration-200
              ${isOpen ? "rotate-180" : "rotate-0"}`}
            />
          </div>


          <button
            type="button"
            onClick={addStakeholder}
            className="flex items-center gap-1 px-3 py-2
            bg-[#0B2B70] text-white rounded-lg"
          >
            <Plus size={16} />
            Adicionar
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <div className="flex flex-wrap gap-2 mt-3">
            {stakeholders.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2
                bg-[#E7EEFF] text-[#0B2B70]
                px-3 py-1 rounded-full text-sm font-medium"
              >
                {item.name}
                <span className="text-xs opacity-70">
                  ({item.role})
                </span>

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
              className="flex items-center gap-2 px-4 py-2
              bg-[#0B2B70] text-white rounded-lg
              hover:bg-[#0a245e] transition"
            >
              Ver cronograma (Gantt)
            </button>

          </div>
        </div>

        {showGantt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
            <div
              className="
                w-[90vw] max-w-6xl
                max-h-[90vh]
                overflow-hidden
                rounded-xl
                bg-white dark:bg-gray-900
                shadow-lg
                flex flex-col
              "
            >

              
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#0B2B70] dark:text-white p-2">
                  Cronograma de Rollout
                </h2>

                <button
                  onClick={() => setShowGantt(false)}
                  className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Gantt */}
              <div className="flex-1 overflow-auto">
                <RolloutTimeline />
              </div>


              {/* Footer */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowGantt(false)}
                  className="px-4 py-2 rounded-lg border text-sm
                  hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  )
}