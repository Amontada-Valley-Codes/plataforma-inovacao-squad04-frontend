'use client'

import { ShowResultsReportResponse } from "@/api/payloads/experimentation.payload"
import { experimentationService } from "@/api/services/experimentation.service"
import { Check, CircleX, PenSquare, Plus, Rocket, Trash2, Wrench } from "lucide-react"
import { useEffect, useState } from "react"

type ResultsReportProps = {
  pocId: string,
} 

export default function ResultsReport({ pocId }: ResultsReportProps) {
  const [report, setReport] = useState<ShowResultsReportResponse | null>(null)
  const [executiveSummary, setExecutiveSummary] = useState("")
  const [learnings, setLearnings] = useState<string[]>([])
  const [recommendationTxt, setRecommendationTxt] = useState("")
  const [newLearning, setNewLearning] = useState('')
  const [isAddingLearning, setIsAddingLearning] = useState(false)
  const [isEditingLearning, setIsEditingLearning] = useState(false)
  const [finalDecision, setFinalDecision] = useState<"SCALE" | "ADJUST" | "CLOSE">("SCALE")

  const totalChars = learnings.reduce((acc, item) => acc + item.length, 0)

  useEffect(() => {
    const loadReport = async () => {
      try {
        const res = await experimentationService.showReport(pocId)

        setReport(res)
        setExecutiveSummary(res.executiveSummary)
        setLearnings(res.learnings)
        setRecommendationTxt(res.recommendationTxt)
        setFinalDecision(res.recommendation as any)
      } catch {

      }
    }

    loadReport()
    console.log(report)
  }, [pocId])

  const saveReport = async () => {
    const payload = {
      executiveSummary,
      learnings,
      recommendation: finalDecision,
      recommendationTxt,
      kpis: []
    }

    if (report) {
      const updated = await experimentationService.updateReport(report.id, payload)
      setReport(updated)
    } else {
      const created = await experimentationService.createReport(pocId, payload)
      setReport(created)
    }
  }


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
            value={executiveSummary}
            onChange={(e) => setExecutiveSummary(e.target.value)}
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
            value={recommendationTxt}
            onChange={(e) => setRecommendationTxt(e.target.value)}
            maxLength={1000}
            placeholder=" Descreva a recomendação final com base nos resultados da PoC"
            className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3] dark:placeholder:text-white"
          />
        </div>
        <span className="text-xs text-[#98A2B3] dark:text-white/50 mt-1 text-right">0/1000</span>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setFinalDecision("SCALE")} 
          className={`flex-1 p-4 rounded-xl border-2 bg-[#F9FAFB] text-left
          ${finalDecision === "SCALE" ? "border-[#0b2b70]" : "border-gray-400"}`}
        >
          <h3 
            className={`font-semibold flex items-center gap-2 
            ${finalDecision === "SCALE" ? "text-[#0b2b70]" : "text-gray-400"}`}
          >
           <Rocket/> Escalar
          </h3>
          <p className={`text-sm  mt-1 ${finalDecision === "SCALE" ? "text-[#0b2b70]" : "text-gray-400"}`}>
            Levar a ideia para a próxima fase
          </p>
        </button>

        <button 
          onClick={() => setFinalDecision("ADJUST")} 
          className={`flex-1 p-4 rounded-xl border-2 bg-[#F9FAFB] text-left
          ${finalDecision === "ADJUST" ? "border-[#0b2b70]" : "border-gray-400"}`}
        >
          <h3 
            className={`font-semibold flex items-center gap-2 
            ${finalDecision === "ADJUST" ? "text-[#0b2b70]" : "text-gray-400"}`}
          >
           <Wrench/> Ajustar
          </h3>
          <p className={`text-sm mt-1 ${finalDecision === "ADJUST" ? "text-[#0b2b70]" : "text-gray-400"}`}>
            Refinar e testar novamente
          </p>
        </button>

        <button 
          onClick={() => setFinalDecision("CLOSE")} 
          className={`flex-1 p-4 rounded-xl border-2 bg-[#F9FAFB] text-left
          ${finalDecision === "CLOSE" ? "border-[#0b2b70]" : "border-gray-400"}`}
        >
          <h3 
            className={`font-semibold flex items-center gap-2 
            ${finalDecision === "CLOSE" ? "text-[#0b2b70]" : "text-gray-400"}`}
          >
           <CircleX/> Encerrar
          </h3>
          <p className={`text-sm mt-1 ${finalDecision === "CLOSE" ? "text-[#0b2b70]" : "text-gray-400"}`}>
            Levar a ideia para a próxima fase
          </p>
        </button>
      </div>

      <div className="flex justify-end">
        <button
          onClick={saveReport}
          className="mt-6 w-fit px-4 py-2 rounded-lg text-sm font-semibold bg-[#0B2B70] text-white"
        >
          Salvar Relatório
        </button>
      </div>
    </div>
  )
}