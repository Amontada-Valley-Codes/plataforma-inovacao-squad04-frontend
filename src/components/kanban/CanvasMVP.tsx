'use client'

import { Check, PenSquare, Plus, Trash2 } from "lucide-react";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { materializationService } from "@/api/services/materialization.service";
import { Resource } from "./Materialization";

type TypeResource = "PEOPLE" | "TECHNOLOGY" | "FINANCIAL" | "OTHER" | undefined
type Kpi = {
  id?: string
  name: string
  metric: string
  target: string
}

type CanvasMvpProps = {
  challengeId: string;
  mvpId: string | null;
  setMvpId: Dispatch<SetStateAction<string | null>>;
  publicoAlvo: string;
  setPublicoAlvo: Dispatch<SetStateAction<string>>;
  propostaValor: string;
  setPropostaValor: Dispatch<SetStateAction<string>>;
  items: string[];
  setItems: Dispatch<SetStateAction<string[]>>;
  resources: Resource[];
  setResources: Dispatch<SetStateAction<Resource[]>>;
  kpis: Kpi[];
  setKpis: Dispatch<SetStateAction<Kpi[]>>;
}

export default function CanvasMVP({ 
  challengeId,
  mvpId,
  setMvpId,
  propostaValor,
  publicoAlvo,
  setPropostaValor,
  setPublicoAlvo, 
  items,
  kpis,
  resources,
  setItems,
  setKpis,
  setResources,
}: CanvasMvpProps) {
  const [newItem, setNewItem] = useState('')
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [isEditingItem, setIsEditingItem] = useState(false)
  const [content, setContent] = useState('')
  const [type, setType] = useState<TypeResource>()
  const [isAddingResource, setIsAddingResource] = useState(false)
  const [isEditingResource, setIsEditingResource] = useState(false)
  const [newKpiName, setNewKpiName] = useState("")
  const [newKpiMetric, setNewKpiMetric] = useState("")
  const [newKpiTarget, setNewKpiTarget] = useState("")
  const [isAddingKpi, setIsAddingKpi] = useState(false)

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
          setKpis(
            mvp.kpis.map(k => ({
              id: k.id,
              name: k.name,
              metric: k.metric,
              target: k.target
            }))
          )
        }


        const mappedResources = mvp.resources.map(r => ({
          content: r.description,
          type: r.type as TypeResource
        }))

        setResources(mappedResources)

      } catch (err) {
        console.error("Erro ao buscar MVP:", err)
      }
    }

    fetchMvp()
  }, [])

  const addItem = () => {
    if (!newItem.trim()) return

    setItems(prev => [...prev, newItem.trim()])
    setNewItem('')
  }

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((v, i) => i !== index))
  }

  const addResource = () => {
    if (!content.trim() || !type) return

    setResources(prev => [...prev, {content: content.trim(), type: type}])
    setContent('')
    setType(undefined)
  }

  const removeResource = (index: number) => {
    setResources(prev => prev.filter((v, i) => i !== index))
  }

  const addKpi = () => {
    if (
      !newKpiName.trim() ||
      !newKpiMetric.trim() ||
      !newKpiTarget.trim()
    ) return

    const newKpi: Kpi = {
      name: newKpiName,
      metric: newKpiMetric,
      target: newKpiTarget
    }

    setKpis(prev => [...prev, newKpi])

    setNewKpiName("")
    setNewKpiMetric("")
    setNewKpiTarget("")
    setIsAddingKpi(false)
  }

  return (
    <div>

      <div className="flex flex-col mb-4">
        <h1 className="flex justify-between gap-1 items-center text-[#0B2B70] dark:text-white font-semibold mb-3">
          Público-Alvo
        </h1>

        <div className="flex-1 flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
          <textarea 
            required
            rows={5}
            maxLength={300}
            value={publicoAlvo}
            onChange={(e) => setPublicoAlvo(e.target.value)}
            placeholder="Defina o público-alvo" 
            className="w-full bg-transparent text-sm outline-none text-black/80 dark:text-white placeholder:text-[#98A2B3] resize-none"
          />
        </div>
       <span className="text-xs text-[#98A2B3] dark:text-white/50 mt-1 text-right">
          {publicoAlvo.length}/300
       </span>
      </div>

      <div className="flex flex-col mb-4">
        <h1 className="flex gap-1 items-center text-[#0B2B70] dark:text-white font-semibold mb-1">
          Proposta de Valor
        </h1>

        <div className="flex-1 flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
          <textarea 
            required
            rows={5}
            maxLength={300}
            value={propostaValor}
            onChange={(e) => setPropostaValor(e.target.value)}
            placeholder="Defina a proposta de valor" 
            className="w-full bg-transparent text-sm outline-none text-black/80 dark:text-white placeholder:text-[#98A2B3] resize-none"
          />
        </div>
        <span className="text-xs text-[#98A2B3] dark:text-white/50 mt-1 text-right">
          {propostaValor.length}/300
       </span>
      </div>

      <div className="flex flex-col mb-4">
        <h1 className="flex gap-1 justify-between items-center text-[#0B2B70] dark:text-white font-semibold mb-1">
          Funcionalidades
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditingItem(true)} 
              className="flex w-fit justify-center p-1
              rounded-[8px] bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors text-[#0B2B70] font-semibold
              text-[12px] cursor-pointer"
            >
              <PenSquare size={14}/>
            </button>

            <button
              onClick={() => setIsAddingItem(true)} 
              className="flex w-fit justify-center p-1
              rounded-[8px] bg-[#0B2B70] hover:bg-[#09245e] transition-colors text-white font-semibold
              text-[12px] cursor-pointer"
            >
              <Plus size={14}/>
            </button>
          </div>
        </h1>

        {items.length !== 0 ? (
          <ol className="list-decimal pl-4 space-y-2">
            {items.map((item, i) => (
              <li 
                key={i}
                className="text-sm"
              >
                <span className="flex justify-between items-center text-gray-600 dark:text-white font-medium text-justify">
                  {item}

                  {isEditingItem && (
                    <button
                      onClick={() => {
                        removeItem(i)
                        setIsEditingItem(false)
                      }}
                      className="flex w-fit justify-center p-1
                      rounded-[8px] bg-[#0B2B70] hover:bg-[#09245e] transition-colors text-white font-semibold
                      text-[12px] cursor-pointer"
                    >
                      <Trash2 size={14}/>
                    </button>
                  )}
                </span>
              </li>
            ))}
          </ol>
        ) : (    
          <div className="flex flex-col mb-4">
            <p className="text-sm text-[#98A2B3] dark:text-white/50 mt-1">Nenhuma funcionalidade adicionada.</p>
          </div>
        )}

        {isAddingItem && (
          <div className="flex gap-4">
            <div className="flex-1 flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
              <input  
                type="text"
                maxLength={1000}
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)} 
                className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3] dark:placeholder:text-white"
              />
            </div>

            <button
              onClick={() => {
                addItem()
                setIsAddingItem(false)
              }}
              className="flex w-10 justify-center items-center p-1
              rounded-[8px] bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors text-[#0B2B70] font-semibold
              text-[14px] cursor-pointer"
            >
              <Check size={14}/>
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col mb-4">
        <h1 className="flex gap-1 items-center justify-between text-[#0B2B70] dark:text-white font-semibold mb-1">
          Indicadores
      
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddingKpi(true)} 
              className="flex w-fit justify-center p-1
              rounded-[8px] bg-[#0B2B70] hover:bg-[#09245e] transition-colors text-white font-semibold
              text-[12px] cursor-pointer"
            >
              <Plus size={14}/>
            </button>
          </div>  
        </h1>
      
        {isAddingKpi && (
          <div className="flex gap-4 mb-4">
            <div className="flex-1 flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
              <input
                required
                maxLength={1000}
                value={newKpiName}
                onChange={(e) => setNewKpiName(e.target.value)}
                placeholder="Nome"
                className="w-full bg-transparent text-sm outline-none text-black/80 dark:text-white placeholder:text-[#98A2B3] dark:placeholder:text-white"
              />
            </div>
      
            <div className="flex-[0.5] flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
              <input
                required
                maxLength={1000}
                value={newKpiTarget}
                onChange={(e) => setNewKpiTarget(e.target.value)}
                placeholder="Meta"
                className="w-full bg-transparent text-sm outline-none text-black/80 dark:text-white placeholder:text-[#98A2B3] dark:placeholder:text-white"
              />
            </div>
      
            <div className="flex-1 flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
              <input
                required
                maxLength={1000}
                value={newKpiMetric}
                onChange={(e) => setNewKpiMetric(e.target.value)}
                placeholder="Métrica"
                className="w-full bg-transparent text-sm outline-none text-black/80 dark:text-white placeholder:text-[#98A2B3] dark:placeholder:text-white"
              />
            </div>
      
            <button
              onClick={() => {
                addKpi()
                setIsAddingKpi(false)
              }}
              className="flex w-10 justify-center items-center p-1
              rounded-[8px] bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors text-[#0B2B70] font-semibold
              text-[14px] cursor-pointer"
            >
              <Check size={14}/>
            </button>
          </div>
        )}
      
        {kpis.length > 0 ? (
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
                    <div className="flex items-center justify-center gap-2">
                      Métrica
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y-2 divide-[#15358D]">
                {kpis.map((ind, i) => {
                  const isLast = i === kpis.length - 1

                  return (
                    <tr
                      key={ind.id ?? i}
                      className="odd:bg-white text-center dark:odd:bg-[#101828]"
                    >
                      <td
                        className={`px-6 py-3 text-sm text-gray-600 dark:text-white font-medium
                        border-[#15358D] ${!isLast ? "border-b-2" : ""} ${isLast ? "rounded-bl-[12px]" : ""}`}
                      >
                        {ind.name}
                      </td>

                      <td
                        className={`px-6 py-3 text-sm text-gray-600 dark:text-white font-medium
                        border-[#15358D] ${!isLast ? "border-b-2" : ""}`}
                      >
                        {ind.target}
                      </td>

                      <td
                        className={`px-6 py-3 text-sm text-gray-600 dark:text-white font-medium
                        border-[#15358D] ${!isLast ? "border-b-2" : ""} ${isLast ? "rounded-br-[12px]" : ""}`}
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
            <p className="text-sm text-[#98A2B3] dark:text-white/50 mt-1">Nenhum indicador definido.</p>
          </div>
        )}
      </div>

      <div className="flex flex-col mb-4">
        <h1 className="flex gap-1 justify-between items-center text-[#0B2B70] dark:text-white font-semibold mb-1">
          Recursos Necessários
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditingResource(true)} 
              className="flex w-fit justify-center p-1
              rounded-[8px] bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors text-[#0B2B70] font-semibold
              text-[12px] cursor-pointer"
            >
              <PenSquare size={14}/>
            </button>

            <button
              onClick={() => setIsAddingResource(true)} 
              className="flex w-fit justify-center p-1
              rounded-[8px] bg-[#0B2B70] hover:bg-[#09245e] transition-colors text-white font-semibold
              text-[12px] cursor-pointer"
            >
              <Plus size={14}/>
            </button>
          </div>
        </h1>

        {isAddingResource && (
          <div className="flex gap-4">
            <div className="flex-1 flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
              <input  
                type="text"
                maxLength={300}
                value={content}
                onChange={(e) => setContent(e.target.value)} 
                className="w-full bg-transparent text-sm outline-none text-black/80 dark:text-white placeholder:text-[#98A2B3] "
              />
            </div>

            <div className="flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
              <select
                value={type ?? ""}
                onChange={(e) => setType(e.target.value as TypeResource)}
              >
                <option value="" disabled>Selecione o tipo</option>
                <option value="PEOPLE">Pessoa</option>
                <option value="TECHNOLOGY">Tecnologia</option>
                <option value="FINANCIAL">Financeiro</option>
                <option value="OTHER">Outro</option>
              </select>
            </div>

            <button
              onClick={() => {
                addResource()
                setIsAddingResource(false)
              }}
              className="flex w-10 justify-center items-center p-1
              rounded-[8px] bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors text-black/80 dark:text-white font-semibold
              text-[14px] cursor-pointer"
            >
              <Check size={14}/>
            </button>
          </div>
        )}

        <div>
          <div className="mb-3 text-[#0B2B70] dark:text-white font-semibold">
            <h1>
              Pessoas
            </h1>

            <ul className="list-disc pl-4 space-y-2">
              {resources.filter((v) => v.type === "PEOPLE").map((resource, i) => (
                <li key={i}>
                  <span className="flex justify-between items-center text-gray-600 dark:text-white font-medium text-justify">
                    {resource.content}

                    {isEditingResource && (
                      <button
                        onClick={() => {
                          removeResource(i)
                          setIsEditingResource(false)
                        }}
                        className="flex w-fit justify-center p-1
                        rounded-[8px] bg-[#0B2B70] hover:bg-[#09245e] transition-colors text-white font-semibold
                        text-[12px] cursor-pointer"
                      >
                        <Trash2 size={14}/>
                      </button>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <hr className="border-gray-400"/>

          <div className="my-3 text-[#0B2B70] dark:text-white font-semibold">
            <h1>
              Tecnologias
            </h1>

            <ul className="list-disc pl-4 space-y-2">
              {resources.filter((v) => v.type === "TECHNOLOGY").map((resource, i) => (
                <li key={i}>
                  <span className="flex justify-between items-center text-gray-600 dark:text-white font-medium text-justify">
                    {resource.content}

                    {isEditingResource && (
                      <button
                        onClick={() => {
                          removeResource(i)
                          setIsEditingResource(false)
                        }}
                        className="flex w-fit justify-center p-1
                        rounded-[8px] bg-[#0B2B70] hover:bg-[#09245e] transition-colors text-white font-semibold
                        text-[12px] cursor-pointer"
                      >
                        <Trash2 size={14}/>
                      </button>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <hr className="border-gray-400"/>

          <div className="my-3 text-[#0B2B70] dark:text-white font-semibold">
            <h1>
              Financeiros
            </h1>

            <ul className="list-disc pl-4 space-y-2">
              {resources.filter((v) => v.type === "FINANCIAL").map((resource, i) => (
                <li key={i}>
                  <span className="flex justify-between items-center text-gray-600 dark:text-white font-medium text-justify">
                    {resource.content}

                    {isEditingResource && (
                      <button
                        onClick={() => {
                          removeResource(i)
                          setIsEditingResource(false)
                        }}
                        className="flex w-fit justify-center p-1
                        rounded-[8px] bg-[#0B2B70] hover:bg-[#09245e] transition-colors text-white font-semibold
                        text-[12px] cursor-pointer"
                      >
                        <Trash2 size={14}/>
                      </button>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <hr className="border-gray-400"/>

          <div className="my-3 text-[#0B2B70] dark:text-white font-semibold">
            <h1>
              Outros
            </h1>

            <ul className="list-disc pl-4 space-y-2">
              {resources.filter((v) => v.type === "OTHER").map((resource, i) => (
                <li key={i}>
                  <span className="flex justify-between items-center text-gray-600 dark:text-white font-medium text-justify">
                    {resource.content}

                    {isEditingResource && (
                      <button
                        onClick={() => {
                          removeResource(i)
                          setIsEditingResource(false)
                        }}
                        className="flex w-fit justify-center p-1
                        rounded-[8px] bg-[#0B2B70] hover:bg-[#09245e] transition-colors text-white font-semibold
                        text-[12px] cursor-pointer"
                      >
                        <Trash2 size={14}/>
                      </button>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-gray-400"/>

      </div>
    </div>
  )
}