'use client'

import { experimentationService } from "@/api/services/experimentation.service";
import { Check, ChevronDown, Plus } from "lucide-react";
import { useState } from "react"

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
      pocId: string,
      kpiId: null,
      createdAt: string
    }[]
  };
  updateObjective: (newObjective: string) => void;
  updateScope: (newScope: string) => void;
}

export default function CanvasPoC({ poc, updateObjective, updateScope }: CanvasPoCProps) {
  const [objective, setObjective] = useState(poc.objective)
  const [scope, setScope] = useState(poc.scope)
  const [hypotheses, setHypotheses] = useState(poc.pocHypotheses)
  const [newHypothesis, setNewHypothesis] = useState('')
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

  return (
    <div className="flex flex-col gap-1 mb-6">
      <h1 className="text-[#0B2B72] dark:text-white text-2xl font-semibold mb-4">Canvas da PoC</h1>

      <div className="flex flex-col mb-4">
        <h1 className="flex gap-1 items-center text-black dark:text-white text-lg mb-1">
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
            className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3] dark:placeholder:text-white"
          />
        </div>
        <span className="text-xs text-[#98A2B3] dark:text-white/50 mt-1 text-right">{objective?.length}/300</span>
      </div>

      <div className="flex flex-col mb-4">
        <h1 className="flex gap-1 items-center justify-between text-black dark:text-white text-lg mb-1">
          Hipóteses

          <div className="flex gap-2">
            {/* <button
              onClick={() => setIsEditingItem(true)} 
              className="flex w-fit justify-center p-1
              rounded-[8px] bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors text-[#0B2B70] font-semibold
              text-[12px] cursor-pointer"
            >
              <PenSquare size={14}/>
            </button> */}

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
                className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3] dark:placeholder:text-white"
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

        <div className="mb-4">
          {hypotheses.map((hyp, i) => (
            <div className="mb-2 flex flex-col">
              <div className="flex justify-between items-center">
                <p className="text-gray-900">{i+1}º Hipótese:</p>
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
              <p className="text-gray-600">{hyp.description}</p>
              <hr className="border-gray-400 mt-1"/>
            </div>
          ))}
        </div>

        <div className="flex flex-col mb-4">
          <h1 className="flex gap-1 items-center text-black dark:text-white text-lg mb-1">
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
              className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3] dark:placeholder:text-white"
            />
          </div>
          <span className="text-xs text-[#98A2B3] dark:text-white/50 mt-1 text-right">{scope?.length}/1500</span>
        </div>

      </div>
    </div>
  )
}