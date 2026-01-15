'use client'

import { Check, PenSquare, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type TypeResource = "PEOPLE" | "TECH" | "FINANCIAL" | "INFRASTRUCTURE" | "PARTNERSHIPS" | undefined
type Resource = {content: string; type: TypeResource}

export default function CanvasMVP() {
  const [items, setItems] = useState<string[]>([])
  const [newItem, setNewItem] = useState('')
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [isEditingItem, setIsEditingItem] = useState(false)
  const [resources, setResources] = useState<Resource[]>([])
  const [content, setContent] = useState('')
  const [type, setType] = useState<TypeResource>()
  const [isAddingResource, setIsAddingResource] = useState(false)
  const [isEditingResource, setIsEditingResource] = useState(false)

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

  return (
    <div>

      <div className="flex flex-col mb-4">
        <h1 className="flex gap-1 items-center text-black dark:text-white text-lg mb-1">
          Público-Alvo
        </h1>

        <div className="flex-1 flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
          <input  
            type="text"
            maxLength={300} 
            className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3] dark:placeholder:text-white"
          />
        </div>
      </div>

      <div className="flex flex-col mb-4">
        <h1 className="flex gap-1 items-center text-black dark:text-white text-lg mb-1">
          Proposta de Valor
        </h1>

        <div className="flex-1 flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
          <input  
            type="text"
            maxLength={500} 
            className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3] dark:placeholder:text-white"
          />
        </div>
      </div>

      <div className="flex flex-col mb-4">
        <h1 className="flex gap-1 justify-between items-center text-black dark:text-white text-lg mb-1">
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
        <h1 className="flex gap-1 justify-between items-center text-black dark:text-white text-lg mb-1">
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
                className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3] dark:placeholder:text-white"
              />
            </div>

            <div className="flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
              <select
                value={type ?? ""}
                onChange={(e) => setType(e.target.value as TypeResource)}
              >
                <option value="" disabled>Selecione o tipo</option>
                <option value="PEOPLE">Pessoa</option>
                <option value="TECH">Tecnologia</option>
                <option value="FINANCIAL">Financeiro</option>
                <option value="INFRASTRUCTURE">Infraestrutura</option>
                <option value="PARTNERSHIPS">Parceiro</option>
              </select>
            </div>

            <button
              onClick={() => {
                addResource()
                setIsAddingResource(false)
              }}
              className="flex w-10 justify-center items-center p-1
              rounded-[8px] bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors text-[#0B2B70] font-semibold
              text-[14px] cursor-pointer"
            >
              <Check size={14}/>
            </button>
          </div>
        )}

        <div>
          <div className="mb-3">
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

          <div className="mb-3">
            <h1>
              Tecnologias
            </h1>

            <ul className="list-disc pl-4 space-y-2">
              {resources.filter((v) => v.type === "TECH").map((resource, i) => (
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

          <div className="mb-3">
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

          <div className="mb-3">
            <h1>
              Infraestruturas
            </h1>

            <ul className="list-disc pl-4 space-y-2">
              {resources.filter((v) => v.type === "INFRASTRUCTURE").map((resource, i) => (
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

          <div className="mb-3">
            <h1>
              Parcerias
            </h1>

            <ul className="list-disc pl-4 space-y-2">
              {resources.filter((v) => v.type === "PARTNERSHIPS").map((resource, i) => (
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

      </div>
    </div>
  )
}