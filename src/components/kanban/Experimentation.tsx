/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import { useState } from "react";
import { CardContentsHeader } from "./CardsContents"
import { Toaster } from "react-hot-toast";
import { Check, ChevronDown, PenSquare, Plus } from "lucide-react";

type CardExperimentationContentProps = {
  challangeTitle: string;
  challengeId: string
  category: string;
  description: string;
  startDate: string;
  creator: string;
  visibility: string;
}

type Hypothesis = {
  content: string;
  status: string;
}

export const Experimentation = ({ challangeTitle, challengeId, category, startDate, creator, visibility }: CardExperimentationContentProps) => {
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([])
  const [newHypothesis, setNewHypothesis] = useState('')
  const [isAddingHyp, setIsAddingHyp] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const addHypothesis = () => {
    if (!newHypothesis.trim()) return

    setHypotheses(prev => [...prev, { content: newHypothesis, status: "PENDENTE"}])
    setNewHypothesis('')
  }

  const updateStatus = (index: number, newStatus: string) => {
    setHypotheses(prev => 
      prev.map((hyp, i) => 
        i === index 
          ? { ...hyp, status: newStatus }
          : hyp
      )
    )
  }

  return (
    <div  className="w-full flex flex-col overflow-y-auto">
      <Toaster position="top-right" reverseOrder={false} />

      <CardContentsHeader
        challengeTitle={challangeTitle}
        category={category}
        startDate={startDate}
        creator={creator}
        visibility={visibility}
      />
      
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
              placeholder="Defina o objetivo" 
              className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3] dark:placeholder:text-white"
            />
          </div>
          <span className="text-xs text-[#98A2B3] dark:text-white/50 mt-1 text-right">0/300</span>
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
                      onChange={(e) => updateStatus(i, e.target.value)}
                      onFocus={() => setIsOpen(true)}
                      onBlur={() => setIsOpen(false)}
                      className="flex justify-center px-2 py-1 appearance-none
                      cursor-pointer rounded-[8px] outline-none"
                    >
                      <option value="PENDENTE">PENDENTE</option>
                      <option value="VALIDA">VÁLIDADA</option>
                      <option value="INVALIDA">INVALIDADA</option>
                    </select>

                    <ChevronDown
                      size={20}
                      className={`text-[#0B2B70] absolute right-2 pointer-events-none
                                transition-transform duration-200
                                ${isOpen ? "rotate-180" : "rotate-0"}`}/>
                  </div>
                </div>
                <p className="text-gray-600">{hyp.content}</p>
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
                placeholder="Defina o escopo" 
                className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3] dark:placeholder:text-white"
              />
            </div>
            <span className="text-xs text-[#98A2B3] dark:text-white/50 mt-1 text-right">0/1500</span>
          </div>

        </div>
      </div>
    </div>
  )
}