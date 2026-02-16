'use client'

import { experimentationService } from "@/api/services/experimentation.service";
import { Check, ChevronDown, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react"

type CanvasPoCProps = {
  poc: {
    id: string,
    objective: string,
    scope: string,
    createdAt: string,
    updatedAt: string,
    experimentationId: string,
    pocHypotheses: {
      id: string,
      description: string,
      status: string,
      pocId: string
    }[],
    poCIndicators: {
      id: string,
      name: string,
      target: string,
      metric: string,
      pocId: string,
      kpiId: string | null,
      createdAt: string
    }[]
  };
  updateObjective: (newObjective: string) => void;
  updateScope: (newScope: string) => void;
}

export default function CanvasPoC({ poc, updateObjective, updateScope }: CanvasPoCProps) {
  const [objective, setObjective] = useState(poc.objective)
  const [scope, setScope] = useState(poc.scope)
  const [hypotheses, setHypotheses] = useState(poc.pocHypotheses ?? [])
  const [newHypothesis, setNewHypothesis] = useState('')
  const [indicators, setIndicators] = useState(poc.poCIndicators ?? [])
  const [newIndicatorName, setNewIndicatorName] = useState("")
  const [newIndicatorMetric, setNewIndicatorMetric] = useState("")
  const [newIndicatorTarget, setNewIndicatorTarget] = useState("")
  const [isAddingIndicator, setIsAddingIndicator] = useState(false)
  const [isAddingHyp, setIsAddingHyp] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const addHypothesis = async () => {
    if (!newHypothesis.trim()) return

    const hypothesis = await experimentationService.createHypothesis(poc.id, {
      description: newHypothesis,
      status: "PENDING"
    })

    setHypotheses(prev => [...prev, hypothesis])
    setNewHypothesis('')
  }

  const updateStatus = async (id: string, newStatus: string) => {
    const updated = await experimentationService.updateHypothesis(id, {
      description: hypotheses.find(h => h.id === id)!.description,
      status: newStatus
    })

    setHypotheses(prev => 
      prev.map(h => h.id === id ? updated : h)
    )
  }

  const addIndicator = async () => {
    if (
      !newIndicatorName.trim() ||
      !newIndicatorTarget.trim() ||
      !newIndicatorMetric.trim()
    ) return

    const newIndicator = await experimentationService.createIndicators(poc.id, {
      kpiId: null,
      metric: newIndicatorMetric,
      name: newIndicatorName,
      target: newIndicatorTarget
    })

    setIndicators(prev => [...prev, newIndicator])

    setNewIndicatorName("")
    setNewIndicatorMetric("")
    setNewIndicatorTarget("")
    setIsAddingIndicator(false)
  }

  const deleteHypothesis = async (hypothesisId: string) => {
    await experimentationService.deleteHypothesis(hypothesisId)

    setHypotheses(prev =>
      prev.filter(i => i.id !== hypothesisId)
    )
  }

  const deleteIndicator = async (indicatorId: string) => {
    await experimentationService.deleteIndicators(indicatorId)

    setIndicators(prev =>
      prev.filter(i => i.id !== indicatorId)
    )
  }

  useEffect(() => {
    setIndicators(poc.poCIndicators ?? [])
    setHypotheses(poc.pocHypotheses ?? [])
    setObjective(poc.objective)
    setScope(poc.scope)
  }, [poc.id])

  return (
    <div className="flex flex-col gap-1 mb-6">
      <h1 className="text-[#0B2B72] dark:text-white text-2xl font-semibold mb-4">Canvas da PoC</h1>

      <div className="flex flex-col mb-4">
        <h1 className="flex gap-1 items-center text-[#0B2B70] dark:text-white font-semibold mb-1">
        Objetivo da Poc
        </h1>

        <div className="flex-1 flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
          <textarea 
            required
            rows={5}
            maxLength={300}
            value={objective}
            onChange={(e) => {
              const value = e.target.value
              setObjective(value)
              updateObjective(value)
            }}
            placeholder="Defina o objetivo" 
            className="w-full bg-transparent text-sm outline-none text-black/80 dark:text-white placeholder:text-[#98A2B3] dark:placeholder:text-white resize-none"
          />
        </div>
        <span className="text-xs text-[#98A2B3] dark:text-white/50 mt-1 text-right">{objective?.length}/300</span>
      </div>

      <div className="flex flex-col mb-4">
        <h1 className="flex gap-1 items-center justify-between text-[#0B2B70] dark:text-white font-semibold mb-1">
          Hipóteses

          <div className="flex gap-2">
            <button
              onClick={() => setIsAddingHyp(true)} 
              className="flex w-fit justify-center p-1
              rounded-[8px] bg-[#0B2B70] hover:bg-[#09245e] transition-colors text-white font-semibold
              text-[12px] cursor-pointer"
            >
              <Plus size={14}/>
            </button>
          </div>
        </h1>

        {isAddingHyp && (
          <div className="flex gap-4 mb-4">
            <div className="flex-1 flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
              <input
                required
                maxLength={1000}
                value={newHypothesis}
                onChange={(e) => setNewHypothesis(e.target.value)}
                placeholder="Adicione uma hipotese"
                className="w-full bg-transparent text-sm outline-none text-black/80 dark:text-white placeholder:text-[#98A2B3] dark:placeholder:text-white"
              />
            </div>

            <button
              onClick={() => {
                addHypothesis()
                setIsAddingHyp(false)
              }}
              className="flex w-10 justify-center items-center p-1
              rounded-[8px] bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors text-[#0B2B70] font-semibold
              text-[14px] cursor-pointer"
            >
              <Check size={14}/>
            </button>
          </div>
        )}

        {hypotheses && hypotheses.length > 0 ? (
          <div className="mb-4">
            {hypotheses.map((hyp, i) => (
              <div key={hyp.id} className="mb-2 flex flex-col">
                <div className="flex justify-between items-center">
                  <p className="text-gray-900">{i+1}º Hipótese:</p>
                  <div className="flex items-center gap-2">
                    <button
                      title="Deletar hipótese"
                      onClick={() => deleteHypothesis(hyp.id)} 
                      className="flex w-fit justify-center p-1
                      rounded-[8px] transition-colors text-red-700 font-semibold
                      text-[12px] cursor-pointer"
                    >
                      <Trash2 size={16}/>
                    </button>
                    <div className="flex items-center bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors text-[#0B2B70] font-semibold
                    text-[12px] rounded-[8px] pr-6 relative">
                      <select
                        value={hyp.status}
                        onChange={(e) => updateStatus(hyp.id, e.target.value)}
                        onFocus={() => setIsOpen(true)}
                        onBlur={() => setIsOpen(false)}
                        className="flex justify-center px-2 py-1 appearance-none
                        cursor-pointer rounded-[8px] outline-none"
                      >
                        <option value="PENDING">PENDENTE</option>
                        <option value="VALIDATED">VÁLIDADA</option>
                        <option value="INVALIDATED">INVALIDADA</option>
                      </select>

                      <ChevronDown
                        size={20}
                        className={`text-[#0B2B70] absolute right-2 pointer-events-none
                                  transition-transform duration-200
                                  ${isOpen ? "rotate-180" : "rotate-0"}`}/>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{hyp.description}</p>
                <hr className="border-gray-400 mt-1"/>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col mb-4">
            <p className="text-sm text-[#98A2B3] dark:text-white/50 mt-1">Nenhuma hipótese cadastrada </p>
            <p className="text-sm text-[#98A2B3] dark:text-white/50 mt-1">Adicione hipóteses para testar se a PoC valida o problema proposto.</p>
          </div>
        )}

        <div className="flex flex-col mb-4">
          <h1 className="flex gap-1 items-center justify-between text-[#0B2B70] dark:text-white font-semibold mb-1">
            Indicadores

            <div className="flex gap-2">
              <button
                onClick={() => setIsAddingIndicator(true)} 
                className="flex w-fit justify-center p-1
                rounded-[8px] bg-[#0B2B70] hover:bg-[#09245e] transition-colors text-white font-semibold
                text-[12px] cursor-pointer"
              >
                <Plus size={14}/>
              </button>
            </div>  
          </h1>

          {isAddingIndicator && (
            <div className="flex gap-4 mb-4">
              <div className="flex-1 flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                <input
                  required
                  maxLength={1000}
                  value={newIndicatorName}
                  onChange={(e) => setNewIndicatorName(e.target.value)}
                  placeholder="Nome"
                  className="w-full bg-transparent text-sm outline-none text-black/80 dark:text-white placeholder:text-[#98A2B3] dark:placeholder:text-white"
                />
              </div>

              <div className="flex-[0.5] flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                <input
                  required
                  maxLength={1000}
                  value={newIndicatorTarget}
                  onChange={(e) => setNewIndicatorTarget(e.target.value)}
                  placeholder="Meta"
                  className="w-full bg-transparent text-sm outline-none text-black/80 dark:text-white placeholder:text-[#98A2B3] dark:placeholder:text-white"
                />
              </div>

              <div className="flex-1 flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                <input
                  required
                  maxLength={1000}
                  value={newIndicatorMetric}
                  onChange={(e) => setNewIndicatorMetric(e.target.value)}
                  placeholder="Métrica"
                  className="w-full bg-transparent text-sm outline-none text-black/80 dark:text-white placeholder:text-[#98A2B3] dark:placeholder:text-white"
                />
              </div>

              <button
                onClick={() => {
                  addIndicator()
                  setIsAddingIndicator(false)
                }}
                className="flex w-10 justify-center items-center p-1
                rounded-[8px] bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors text-[#0B2B70] font-semibold
                text-[14px] cursor-pointer"
              >
                <Check size={14}/>
              </button>
            </div>
          )}

          {indicators.length > 0 ? (
            <div className="rounded-[12px] overflow-x-auto w-full border-x-2 border-b-2 border-[#15358D]">
              <table className="table-auto w-full border-separate border-spacing-0">
                
                <thead className="bg-[#15358D]">
                  <tr>
                    <th className="pl-3 py-3 text-sm font-semibold text-white bg-[#15358D]">
                      <div className="flex items-center justify-center gap-2 relative">
                        <span className="mr-4">Indicator (KPI)</span>
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-[1.5px] rounded bg-gray-500"></span>
                      </div>
                    </th>

                    <th className="pl-3 py-3 text-sm font-semibold text-white bg-[#15358D]">
                      <div className="flex items-center justify-center gap-2 relative">
                        <span className="mr-4">Meta</span>
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-[1.5px] rounded bg-gray-500"></span>
                      </div>
                    </th>

                    <th className="pl-3 py-3 text-sm font-semibold text-white bg-[#15358D]">
                      <div className="flex items-center justify-center gap-2 relative">
                        <span className="mr-4">Métrica</span>
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {indicators.map((ind, i) => {
                    const isLast = i === indicators.length - 1

                    return (
                      <tr
                        key={ind.id}
                        className="odd:bg-white text-center dark:odd:bg-[#101828]"
                      >
                        <td
                          className={`px-6 py-3 text-sm text-gray-600 dark:text-white font-medium
                          border-[#15358D] border-r-2
                          ${!isLast ? "border-b-2" : ""}
                          ${isLast ? "rounded-bl-[12px]" : ""}`}
                        >
                          {ind.name}
                        </td>

                        <td
                          className={`px-6 py-3 text-sm text-gray-600 dark:text-white font-medium
                          border-[#15358D] border-r-2
                          ${!isLast ? "border-b-2" : ""}`}
                        >
                          {ind.target}
                        </td>

                        <td
                          className={`px-6 py-3 text-sm text-gray-600 dark:text-white font-medium
                          border-[#15358D] border-r-2
                          ${!isLast ? "border-b-2" : ""}`}
                        >
                          {ind.metric}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>

              </table>
            </div>
          ) : (
            <div className="flex flex-col mb-4">
              <p className="text-sm text-[#98A2B3] dark:text-white/50 mt-1">Nenhum indicador definido</p>
              <p className="text-sm text-[#98A2B3] dark:text-white/50 mt-1">Adicione KPIs para definir como o sucesso da PoC será medido.</p>
            </div>
          )}
        </div>

        <div className="flex flex-col mb-4">
          <h1 className="flex gap-1 items-center text-[#0B2B70] dark:text-white font-semibold mb-1">
          Escopo
          </h1>

          <div className="flex-1 flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
            <textarea 
              required
              rows={5}
              maxLength={1500}
              value={scope}
              onChange={(e) => {
                const value = e.target.value
                setScope(value)
                updateScope(value)
              }}
              placeholder="Defina o escopo" 
              className="w-full bg-transparent text-sm outline-none text-black/80 dark:text-white placeholder:text-[#98A2B3] dark:placeholder:text-white resize-none"
            />
          </div>
          <span className="text-xs text-[#98A2B3] dark:text-white/50 mt-1 text-right">{scope?.length}/1500</span>
        </div>

      </div>
    </div>
  )
}