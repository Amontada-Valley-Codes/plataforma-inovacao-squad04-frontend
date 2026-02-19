'use client'

import { Check, PenSquare, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { materializationService } from "@/api/services/materialization.service";
import { CreateMvpPayload } from "@/api/payloads/materialization.payload";
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

type TypeResource = "PEOPLE" | "TECHNOLOGY" | "FINANCIAL" | "OTHER" | undefined

type Resource = {
  content: string;
  type: TypeResource;
}

type Kpi = {
  id?: string;
  name: string;
  metric: string;
  target: string;
}

type CanvasMvpProps = {
  challengeId: string;
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export default function CanvasMVP({ challengeId }: CanvasMvpProps) {
  const [mvpId, setMvpId] = useState<string | null>(null)

  // Funcionalidades
  const [items, setItems] = useState<string[]>([])
  const [newItem, setNewItem] = useState('')
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [isEditingItem, setIsEditingItem] = useState(false)

  // Recursos
  const [resources, setResources] = useState<Resource[]>([])
  const [content, setContent] = useState('')
  const [type, setType] = useState<TypeResource>()
  const [isAddingResource, setIsAddingResource] = useState(false)
  const [isEditingResource, setIsEditingResource] = useState(false)

  // Textos
  const [publicoAlvo, setPublicoAlvo] = useState("")
  const [propostaValor, setPropostaValor] = useState("")

  // KPIs
  const [kpis, setKpis] = useState<Kpi[]>([])
  const [newKpiName, setNewKpiName] = useState("")
  const [newKpiMetric, setNewKpiMetric] = useState("")
  const [newKpiTarget, setNewKpiTarget] = useState("")
  const [isAddingKpi, setIsAddingKpi] = useState(false)

  // ── Data fetching ──────────────────────────

  useEffect(() => {
    const fetchMvp = async () => {
      try {
        const allMvps = await materializationService.showAllMvp()
        const mvp = allMvps.find(mvp => mvp.challengeId === challengeId)

        if (!mvp) return

        setMvpId(mvp.id)
        setPublicoAlvo(mvp.targetAudience)
        setPropostaValor(mvp.valueProposal)
        setItems(mvp.features)

        if (mvp.kpis) {
          setKpis(mvp.kpis.map(k => ({
            id: k.id,
            name: k.name,
            metric: k.metric,
            target: k.target,
          })))
        }

        setResources(mvp.resources.map(r => ({
          content: r.description,
          type: r.type as TypeResource,
        })))

      } catch (err) {
        console.error("Erro ao buscar MVP:", err)
      }
    }

    fetchMvp()
  }, [challengeId])

  // ── Funcionalidades handlers ───────────────

  const addItem = () => {
    if (!newItem.trim()) return
    setItems(prev => [...prev, newItem.trim()])
    setNewItem('')
  }

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  // ── Recursos handlers ──────────────────────

  const addResource = () => {
    if (!content.trim() || !type) return
    setResources(prev => [...prev, { content: content.trim(), type }])
    setContent('')
    setType(undefined)
  }

  const removeResource = (index: number) => {
    setResources(prev => prev.filter((_, i) => i !== index))
  }

  // ── KPI handlers ───────────────────────────

  const addKpi = () => {
    if (!newKpiName.trim() || !newKpiMetric.trim() || !newKpiTarget.trim()) return
    setKpis(prev => [...prev, { name: newKpiName, metric: newKpiMetric, target: newKpiTarget }])
    setNewKpiName("")
    setNewKpiMetric("")
    setNewKpiTarget("")
    setIsAddingKpi(false)
  }

  const removeKpi = (index: number) => {
    setKpis(prev => prev.filter((_, i) => i !== index))
  }

  // ── Save ───────────────────────────────────

  const handleSave = async () => {
    try {
      const payload: CreateMvpPayload = {
        targetAudience: publicoAlvo,
        valueProposal: propostaValor,
        features: items,
        resources: resources
          .filter(r => r.type)
          .map(r => ({ type: r.type as string, description: r.content })),
        kpis: kpis.map(k => ({ name: k.name, metric: k.metric, target: k.target })),
      }

      if (mvpId) {
        const response = await materializationService.updateMvp(mvpId, payload)
        setMvpId(response.id)
      } else {
        const response = await materializationService.createMvp(challengeId, payload)
        setMvpId(response.id)
      }
    } catch (err: any) {
      console.error("Erro detalhado:", err.response?.data || err)
    }
  }

  // ── Shared styles ──────────────────────────

  const inputClass = `
    w-full bg-transparent text-sm outline-none
    text-black/80 dark:text-white
    placeholder:text-[#98A2B3]
  `

  const inputWrapperClass = `
    flex-1 flex items-center rounded-lg border px-3 py-2 h-10
    transition-colors bg-[#F9FAFB] border-[#E5E7EB]
    dark:border-gray-800 dark:bg-gray-900
  `

  const btnPrimary = `
    flex w-fit justify-center p-1 rounded-[8px]
    bg-[#0B2B70] hover:bg-[#09245e] transition-colors
    text-white font-semibold text-[12px] cursor-pointer
  `

  const btnSecondary = `
    flex w-fit justify-center p-1 rounded-[8px]
    bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors
    text-[#0B2B70] font-semibold text-[12px] cursor-pointer
  `

  const sectionTitle = `
    flex gap-1 items-center justify-between
    text-[#0B2B70] dark:text-white font-semibold mb-1
  `

  // ── Resource section helper ────────────────

  const ResourceList = ({
    label,
    filterType,
  }: {
    label: string;
    filterType: TypeResource;
  }) => (
    <div className="mb-3 text-[#0B2B70] dark:text-white font-semibold">
      <h1>{label}</h1>
      <ul className="list-disc pl-4 space-y-2">
        {resources
          .map((resource, i) => ({ resource, originalIndex: i }))
          .filter(({ resource }) => resource.type === filterType)
          .map(({ resource, originalIndex }) => (
            <li key={originalIndex}>
              <span className="flex justify-between items-center text-gray-600 dark:text-white font-medium text-justify">
                {resource.content}
                {isEditingResource && (
                  <button
                    onClick={() => {
                      removeResource(originalIndex)
                      setIsEditingResource(false)
                    }}
                    className={btnPrimary}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </span>
            </li>
          ))}
      </ul>
    </div>
  )

  // ── Render ─────────────────────────────────

  return (
    <div>

      {/* Público-Alvo */}
      <div className="flex flex-col mb-4">
        <h1 className="flex justify-between gap-1 items-center text-[#0B2B70] dark:text-white font-semibold mb-3">
          Público-Alvo
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1 px-4 py-2 bg-[#0B2B70] text-white text-sm rounded-lg"
          >
            Salvar
          </button>
        </h1>

        <div className={inputWrapperClass}>
          <textarea
            required
            rows={5}
            maxLength={300}
            value={publicoAlvo}
            onChange={(e) => setPublicoAlvo(e.target.value)}
            placeholder="Defina o público-alvo"
            className={`${inputClass} resize-none`}
          />
        </div>
        <span className="text-xs text-[#98A2B3] dark:text-white/50 mt-1 text-right">
          {publicoAlvo.length}/300
        </span>
      </div>

      {/* Proposta de Valor */}
      <div className="flex flex-col mb-4">
        <h1 className="flex gap-1 items-center text-[#0B2B70] dark:text-white font-semibold mb-1">
          Proposta de Valor
        </h1>

        <div className={inputWrapperClass}>
          <textarea
            required
            rows={5}
            maxLength={300}
            value={propostaValor}
            onChange={(e) => setPropostaValor(e.target.value)}
            placeholder="Defina a proposta de valor"
            className={`${inputClass} resize-none`}
          />
        </div>
        <span className="text-xs text-[#98A2B3] dark:text-white/50 mt-1 text-right">
          {propostaValor.length}/300
        </span>
      </div>

      {/* Funcionalidades */}
      <div className="flex flex-col mb-4">
        <h1 className={sectionTitle}>
          Funcionalidades
          <div className="flex gap-2">
            <button onClick={() => setIsEditingItem(true)} className={btnSecondary}>
              <PenSquare size={14} />
            </button>
            <button onClick={() => setIsAddingItem(true)} className={btnPrimary}>
              <Plus size={14} />
            </button>
          </div>
        </h1>

        <ol className="list-decimal pl-4 space-y-2">
          {items.map((item, i) => (
            <li key={i} className="text-sm">
              <span className="flex justify-between items-center text-gray-600 dark:text-white font-medium text-justify">
                {item}
                {isEditingItem && (
                  <button
                    onClick={() => { removeItem(i); setIsEditingItem(false) }}
                    className={btnPrimary}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </span>
            </li>
          ))}
        </ol>

        {isAddingItem && (
          <div className="flex gap-4 mt-2">
            <div className={inputWrapperClass}>
              <input
                type="text"
                maxLength={1000}
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className={inputClass}
              />
            </div>
            <button
              onClick={() => { addItem(); setIsAddingItem(false) }}
              className="flex w-10 justify-center items-center p-1 rounded-[8px] bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors text-[#0B2B70] font-semibold text-[14px] cursor-pointer"
            >
              <Check size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Indicadores (KPIs) */}
      <div className="flex flex-col mb-4">
        <h1 className={sectionTitle}>
          Indicadores
          <button onClick={() => setIsAddingKpi(true)} className={btnPrimary}>
            <Plus size={14} />
          </button>
        </h1>

        {isAddingKpi && (
          <div className="flex gap-4 mb-4">
            <div className={inputWrapperClass}>
              <input
                required
                maxLength={1000}
                value={newKpiName}
                onChange={(e) => setNewKpiName(e.target.value)}
                placeholder="Nome"
                className={inputClass}
              />
            </div>
            <div className="flex-[0.5] flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
              <input
                required
                maxLength={1000}
                value={newKpiTarget}
                onChange={(e) => setNewKpiTarget(e.target.value)}
                placeholder="Meta"
                className={inputClass}
              />
            </div>
            <div className={inputWrapperClass}>
              <input
                required
                maxLength={1000}
                value={newKpiMetric}
                onChange={(e) => setNewKpiMetric(e.target.value)}
                placeholder="Métrica"
                className={inputClass}
              />
            </div>
            <button
              onClick={addKpi}
              className="flex w-10 justify-center items-center p-1 rounded-[8px] bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors text-[#0B2B70] font-semibold text-[14px] cursor-pointer"
            >
              <Check size={14} />
            </button>
          </div>
        )}

        {kpis.length > 0 ? (
          <div className="rounded-[12px] overflow-x-auto w-full border-x-2 border-b-2 border-[#15358D]">
            <table className="table-auto w-full border-separate border-spacing-0">
              <thead className="bg-[#15358D]">
                <tr>
                  {["Indicator (KPI)", "Meta", "Métrica"].map((col, i, arr) => (
                    <th key={col} className="pl-3 py-3 text-sm font-semibold text-white bg-[#15358D]">
                      <div className="flex items-center justify-center gap-2 relative">
                        <span className="mr-4">{col}</span>
                        {i < arr.length - 1 && (
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-[1.5px] rounded bg-gray-500" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#15358D]">
                {kpis.map((ind, i) => {
                  const isLast = i === kpis.length - 1
                  return (
                    <tr key={ind.id ?? i} className="odd:bg-white text-center dark:odd:bg-[#101828]">
                      <td className={`px-6 py-3 text-sm text-gray-600 dark:text-white font-medium border-[#15358D] ${!isLast ? "border-b-2" : ""} ${isLast ? "rounded-bl-[12px]" : ""}`}>
                        {ind.name}
                      </td>
                      <td className={`px-6 py-3 text-sm text-gray-600 dark:text-white font-medium border-[#15358D] ${!isLast ? "border-b-2" : ""}`}>
                        {ind.target}
                      </td>
                      <td className={`px-6 py-3 text-sm text-gray-600 dark:text-white font-medium border-[#15358D] ${!isLast ? "border-b-2" : ""} ${isLast ? "rounded-br-[12px]" : ""}`}>
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

      {/* Recursos Necessários */}
      <div className="flex flex-col mb-4">
        <h1 className={sectionTitle}>
          Recursos Necessários
          <div className="flex gap-2">
            <button onClick={() => setIsEditingResource(true)} className={btnSecondary}>
              <PenSquare size={14} />
            </button>
            <button onClick={() => setIsAddingResource(true)} className={btnPrimary}>
              <Plus size={14} />
            </button>
          </div>
        </h1>

        {isAddingResource && (
          <div className="flex gap-4 mb-3">
            <div className={inputWrapperClass}>
              <input
                type="text"
                maxLength={300}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Descrição do recurso"
                className={inputClass}
              />
            </div>

            {/* ── Radix Select para tipo de recurso ── */}
            <Select
              value={type ?? ""}
              onValueChange={(val) => setType(val as TypeResource)}
            >
              <SelectTrigger className="w-[180px] h-10 bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900 text-sm text-[#344054] dark:text-white">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PEOPLE">Pessoa</SelectItem>
                <SelectItem value="TECHNOLOGY">Tecnologia</SelectItem>
                <SelectItem value="FINANCIAL">Financeiro</SelectItem>
                <SelectItem value="OTHER">Outro</SelectItem>
              </SelectContent>
            </Select>

            <button
              onClick={() => { addResource(); setIsAddingResource(false) }}
              className="flex w-10 justify-center items-center p-1 rounded-[8px] bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors text-black/80 dark:text-white font-semibold text-[14px] cursor-pointer"
            >
              <Check size={14} />
            </button>
          </div>
        )}

        <div>
          <ResourceList label="Pessoas"      filterType="PEOPLE"     />
          <hr className="border-gray-400" />
          <ResourceList label="Tecnologias"  filterType="TECHNOLOGY" />
          <hr className="border-gray-400" />
          <ResourceList label="Financeiros"  filterType="FINANCIAL"  />
          <hr className="border-gray-400" />
          <ResourceList label="Outros"       filterType="OTHER"      />
        </div>

        <hr className="border-gray-400" />
      </div>
    </div>
  )
}