'use client'

import { useState } from "react"

type EffortImpact = {
  effort: number
  impact: number
}

type ICE = {
  impact: number
  confidence: number
  ease: number
}

type ICEWeights = {
  impact: number
  confidence: number
  ease: number
}

export default function OnePage() {
  const [valueProposition, setValueProposition] = useState("")
  const [effortImpact, setEffortImpact] = useState<EffortImpact>({
    effort: 0,
    impact: 0,
  })

  const effortImpactScore = effortImpact.effort * effortImpact.impact

  const [ice, setIce] = useState<ICE>({
    impact: 0,
    confidence: 0,
    ease: 0,
  })

  const [weights, setWeights] = useState<ICEWeights>({
    impact: 1,
    confidence: 1,
    ease: 1,
  })

  const [cutoff, setCutoff] = useState(10)

  const iceScore =
    ice.impact * weights.impact +
    ice.confidence * weights.confidence +
    ice.ease * weights.ease

  function ScaleRow({
    title,
    description,
    field,
    color,
  }: {
    title: string
    description: string
    field: keyof ICE
    color: string
  }) {
    return (
      <div className="mb-8">
        <div className="mb-2">
          <h3 className={`text-lg font-semibold ${color}`}>
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-5 gap-6 text-center">
          {[1, 2, 3, 4, 5].map((value) => (
            <label
              key={value}
              className="flex cursor-pointer flex-col items-center gap-2"
            >
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {value}
              </span>
              <input
                type="radio"
                name={field}
                checked={ice[field] === value}
                onChange={() =>
                  setIce((prev) => ({
                    ...prev,
                    [field]: value,
                  }))
                }
                className="h-4 w-4 accent-current"
              />
            </label>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-[24px] font-semibold text-[#0B2B70] dark:text-white">
        One Page da Solução
      </h1>

      <div>
        <h2 className="mb-1 text-lg dark:text-white">
          Proposta de Valor
        </h2>

        <textarea
          rows={5}
          value={valueProposition}
          onChange={(e) => setValueProposition(e.target.value)}
          placeholder="Descreva a proposta de valor"
          className="w-full rounded-lg border bg-[#F9FAFB] p-3 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white"
        />
      </div>

      <div>
        <h2 className="mb-2 text-lg dark:text-white">
          Esforço x Impacto
        </h2>

        <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 dark:border-gray-800">
          <select
            value={effortImpact.effort}
            onChange={(e) =>
              setEffortImpact((impact) => ({
                ...impact,
                effort: Number(e.target.value),
              }))
            }
            className="rounded-md border p-2 dark:bg-gray-900"
          >
            <option value={0}>Esforço</option>
            <option value={1}>Baixo</option>
            <option value={2}>Médio</option>
            <option value={3}>Alto</option>
          </select>

          <select
            value={effortImpact.impact}
            onChange={(e) =>
              setEffortImpact((impact) => ({
                ...impact,
                impact: Number(e.target.value),
              }))
            }
            className="rounded-md border p-2 dark:bg-gray-900"
          >
            <option value={0}>Impacto</option>
            <option value={1}>Baixo</option>
            <option value={2}>Médio</option>
            <option value={3}>Alto</option>
          </select>

          <div className="col-span-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-[#0B2B70] dark:bg-gray-800 dark:text-white">
            <span>Score: </span>
            <span>{effortImpactScore}</span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-lg dark:text-white">
          ICE Score
        </h2>

        <div className="rounded-xl border p-6 dark:border-gray-800">
          <ScaleRow
            title="Impact"
            description="Contribuição para o objetivo"
            field="impact"
            color="text-indigo-600"
          />
          <ScaleRow
            title="Confidence"
            description="Nível de confiança"
            field="confidence"
            color="text-sky-500"
          />
          <ScaleRow
            title="Ease"
            description="Facilidade de execução"
            field="ease"
            color="text-red-500"
          />

          <h3 className="mb-2 font-semibold dark:text-white">
            Pesos
          </h3>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {(["impact", "confidence", "ease"] as const).map((key) => (
              <input
                key={key}
                type="number"
                min={0}
                step={0.1}
                value={weights[key]}
                onChange={(e) =>
                  setWeights((p) => ({
                    ...p,
                    [key]: Number(e.target.value),
                  }))
                }
                className="rounded-md border p-2 dark:bg-gray-900"
              />
            ))}
          </div>

          <label className="mb-1 block text-sm dark:text-white">
            Ponto de corte
          </label>
          <input
            type="number"
            value={cutoff}
            onChange={(e) => setCutoff(Number(e.target.value))}
            className="mb-4 w-full rounded-md border p-2 dark:bg-gray-900"
          />

          <div
            className={`flex justify-between rounded-lg px-4 py-3 font-semibold ${
              iceScore >= cutoff
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
            }`}
          >
            <span>ICE Score</span>
            <span>{iceScore}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
