'use client'

import { Check, CircleX, PenSquare, Plus, Rocket, Trash2, Wrench } from "lucide-react"
import { useState } from "react"

export default function ResultsReport() {
  const [learnings, setLearnings] = useState<string[]>([])
  const [newLearning, setNewLearning] = useState('')
  const [isAddingLearning, setIsAddingLearning] = useState(false)
  const [isEditingLearning, setIsEditingLearning] = useState(false)
  const [finalDecision, setFinalDecision] = useState<"ESCALAR" | "AJUSTAR" | "ENCERRAR">("ESCALAR")

  const totalChars = learnings.reduce((acc, item) => acc + item.length, 0)

  const addLearning = () => {
    if (!newLearning.trim()) return

    const nextTotal = totalChars + newLearning.trim().length
    if (nextTotal > 1000) return

    setLearnings(prev => [...prev, newLearning.trim()])
    setNewLearning('')
  }

  const removeLearning = (index: number) => {
    setLearnings(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-1 mb-6">
      <h1 className="text-[#0B2B72] dark:text-white text-2xl font-semibold mb-4">Relatório de Resultados</h1>

      <div className="flex flex-col mb-4">
        <h1 className="flex gap-1 items-center text-black dark:text-white text-lg mb-1">
          Resumo Executivo
        </h1>

        <div className="flex-1 flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
          <textarea 
            required
            rows={5}
            maxLength={1000}
            placeholder="Descreva de forma objetiva o que foi testado na PoC"
            className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3] dark:placeholder:text-white"
          />
        </div>
        <span className="text-xs text-[#98A2B3] dark:text-white/50 mt-1 text-right">0/1000</span>
      </div>

      <div className="flex flex-col mb-4">
        <h1 className="flex justify-between items-center text-lg mb-1">
          Aprendizados
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditingLearning(true)}
              className="flex w-fit justify-center p-1
              rounded-[8px] bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors text-[#0B2B70] font-semibold
              text-[12px] cursor-pointer"
            >
              <PenSquare size={14} />
            </button>

            <button 
              onClick={() => setIsAddingLearning(true)}
              className="flex w-fit justify-center p-1
              rounded-[8px] bg-[#0B2B70] hover:bg-[#09245e] transition-colors text-white font-semibold
              text-[12px] cursor-pointer"
            >
              <Plus size={14} />
            </button>
          </div>
        </h1>

        <ul className="list-disc pl-4 space-y-2">
          {learnings.map((learning, i) => (
            <li key={i} className="text-sm">
              <span className="flex justify-between items-center text-gray-600 dark:text-white font-medium text-justify">
                {learning}

                {isEditingLearning && (
                  <button
                    onClick={() => {
                      removeLearning(i)
                      setIsEditingLearning(false)
                    }}
                    className="flex w-fit justify-center p-1
                    rounded-[8px] bg-[#0B2B70] hover:bg-[#09245e] transition-colors text-white font-semibold
                    text-[12px] cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </span>
            </li>
          ))}
        </ul>

        {isAddingLearning && (
          <div className="flex gap-4">
            <div className="flex-1 flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
              <input
                type="text"
                maxLength={1000}
                value={newLearning}
                onChange={(e) => setNewLearning(e.target.value)}
                className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3] dark:placeholder:text-white"
              />
            </div>

            <button
              onClick={() => {
                addLearning()
                setIsAddingLearning(false)
              }}
              className="flex w-10 justify-center items-center p-1
              rounded-[8px] bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors text-[#0B2B70] font-semibold
              text-[14px] cursor-pointer"
            >
              <Check size={14} />
            </button>
          </div>
        )}

        <span className="text-xs text-[#98A2B3] dark:text-white/50 mt-1 text-right">
          {totalChars}/1000
        </span>
      </div>

      <div className="flex flex-col mb-4">
        <h1 className="flex gap-1 items-center text-black dark:text-white text-lg mb-1">
          Recomendações (Parecer)
        </h1>

        <div className="flex-1 flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
          <textarea 
            required
            rows={5}
            maxLength={1000}
            placeholder=" Descreva a recomendação final com base nos resultados da PoC"
            className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3] dark:placeholder:text-white"
          />
        </div>
        <span className="text-xs text-[#98A2B3] dark:text-white/50 mt-1 text-right">0/1000</span>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setFinalDecision("ESCALAR")} 
          className={`flex-1 p-4 rounded-xl border-2 bg-[#F9FAFB] text-left
          ${finalDecision === "ESCALAR" ? "border-[#0b2b70]" : "border-gray-400"}`}
        >
          <h3 
            className={`font-semibold flex items-center gap-2 
            ${finalDecision === "ESCALAR" ? "text-[#0b2b70]" : "text-gray-400"}`}
          >
           <Rocket/> Escalar
          </h3>
          <p className={`text-sm  mt-1 ${finalDecision === "ESCALAR" ? "text-[#0b2b70]" : "text-gray-400"}`}>
            Levar a ideia para a próxima fase
          </p>
        </button>

        <button 
          onClick={() => setFinalDecision("AJUSTAR")} 
          className={`flex-1 p-4 rounded-xl border-2 bg-[#F9FAFB] text-left
          ${finalDecision === "AJUSTAR" ? "border-[#0b2b70]" : "border-gray-400"}`}
        >
          <h3 
            className={`font-semibold flex items-center gap-2 
            ${finalDecision === "AJUSTAR" ? "text-[#0b2b70]" : "text-gray-400"}`}
          >
           <Wrench/> Ajustar
          </h3>
          <p className={`text-sm mt-1 ${finalDecision === "AJUSTAR" ? "text-[#0b2b70]" : "text-gray-400"}`}>
            Refinar e testar novamente
          </p>
        </button>

        <button 
          onClick={() => setFinalDecision("ENCERRAR")} 
          className={`flex-1 p-4 rounded-xl border-2 bg-[#F9FAFB] text-left
          ${finalDecision === "ENCERRAR" ? "border-[#0b2b70]" : "border-gray-400"}`}
        >
          <h3 
            className={`font-semibold flex items-center gap-2 
            ${finalDecision === "ENCERRAR" ? "text-[#0b2b70]" : "text-gray-400"}`}
          >
           <CircleX/> Encerrar
          </h3>
          <p className={`text-sm mt-1 ${finalDecision === "ENCERRAR" ? "text-[#0b2b70]" : "text-gray-400"}`}>
            Levar a ideia para a próxima fase
          </p>
        </button>
      </div>
    </div>
  )
}