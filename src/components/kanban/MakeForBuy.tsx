import { Check, ChevronDown, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react"

export default function MakeforBuy() {
  const [isOpen, setIsOpen] = useState(false);
  const [criterion, setCriterion] = useState<string>('');
  const [criteria, setCriteria] = useState<string[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const addCriterion = () => {
    if (!criterion) return
    if (criteria.includes(criterion)) return 

    setCriteria(prev => [...prev, criterion])
    setCriterion('')
  }

  const removeCriterion = (value: string) => {
    setCriteria(prev => prev.filter(item => item !== value))
  }

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if  (!file) return;

    if (file.type !== "application/pdf") {
      alert("Apenas arquivos PDF são permitidos")
      return
    }

    setPdfFile(file);
  }

  const hasFile = Boolean(pdfFile);
  const label = hasFile ? pdfFile!.name : "Upload do Edital do desafio"
  const Icon = hasFile ? Check : Plus

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[24px] text-[#0B2B70] dark:text-white font-semibold mb-4">
          Materialização para Buy
        </h1>

      <div className="flex flex-col">
        {/* BOTÃO DE UPLOAD */}
        <label
          className="flex items-center gap-2 px-3 py-2
          bg-[#0B2B70] text-white rounded-lg
          cursor-pointer hover:opacity-90"
        >
         <Icon/>
         {label}

          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handlePdfUpload}
            className="hidden"
          />
        </label>

      </div>

      </div>

      <div className="flex flex-col mb-4">
        <h1 className="flex gap-1 items-center text-black dark:text-white text-lg mb-1">
          Problema do Edital
        </h1>

        <div className="flex-1 flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
          <textarea  
            required
            rows={5}
            maxLength={2000} 
            placeholder="Descreva o problema no formato HMW"
            className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3] dark:placeholder:text-white"
          />
        </div>
      </div>

      <div className="flex flex-col mb-4">
        <h1 className="flex gap-1 items-center text-black dark:text-white text-lg mb-1">
          Regras do Desafio
        </h1>

        <div className="flex-1 flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
          <textarea 
            required
            rows={5}
            maxLength={2000}
            placeholder="Quais são as regras de negócio?"
            className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3] dark:placeholder:text-white"
          />
        </div>
      </div>

      <div className="flex flex-col mb-4">
        <h1 className="flex gap-1 items-center text-black dark:text-white text-lg mb-1">
          Critérios de Seleção do desafio
        </h1>

        <div className="flex items-center gap-2">
          <div 
            className="flex items-center bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors
            text-[#0B2B70] font-semibold text-[14px] rounded-[8px] relative"
          >
            <select
              value={criterion}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setIsOpen(false)}
              onChange={(e) => setCriterion(e.target.value)}
              className="flex w-fit justify-center p-2 appearance-none
              cursor-pointer rounded-[8px] outline-none"
            >
              <option value="">Definir Critério de Seleção</option>
              <option value="ADEQUACAO_PROBLEMA">Adequação ao problema proposto</option>
              <option value="QUALIDADE_TECNICA">Qualidade técnica da solução</option>
              <option value="INOVACAO">Grau de inovação</option>
              <option value="VIABILIDADE">Viabilidade de execução</option>
              <option value="CLAREZA">Clareza e objetividade da proposta</option>
            </select>

            <ChevronDown
              className={`text-[#0B2B70] absolute right-2 pointer-events-none
              transition-transform duration-200
              ${isOpen ? "rotate-180" : "rotate-0"}`}
            />
          </div>


          <button
            type="button"
            onClick={addCriterion}
            className="flex items-center gap-1 px-3 py-2
            bg-[#0B2B70] text-white rounded-lg"
          >
            <Plus size={16} />
            Adicionar
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {criteria.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2
              bg-[#E7EEFF] text-[#0B2B70]
              px-3 py-1 rounded-full text-sm font-medium"
            >
              {item.replaceAll("_", " ")}

              <button
                type="button"
                onClick={() => removeCriterion(item)}
              >
                <Trash2 className="hover:text-red-600 transition-colors" size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}