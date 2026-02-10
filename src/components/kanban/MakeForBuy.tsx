import { BuyMaterializationService } from "@/api/services/buy-materialization.service";
import { Check, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react"

type MakeForBuyProps = {
  challengeId: string
}

export default function MakeforBuy({ challengeId }: MakeForBuyProps) {
  const [criterion, setCriterion] = useState<string>('');
  const [criteria, setCriteria] = useState<string[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [hmwProblem, setHmwProblem] = useState<string>('');
  const [rules, setRules] = useState<string>('');

  const addCriterion = () => {
    if (!criterion) return

    if (criteria.includes(criterion)) return

    setCriteria(prev => [...prev, criterion]);
    setCriterion('');
  }

  const removeCriterion = (value: string) => {
    setCriteria(prev => prev.filter(item => item !== value));
  }

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfFile(file);
  }

  const hasFile = Boolean(pdfFile);
  const label = hasFile ? pdfFile!.name : "Upload do Edital do desafio"
  const Icon = hasFile ? Check : Plus

  async function handleSubmit() {

    if (!pdfFile) return;

    const formData = new FormData();

    formData.append('hmwProblem', hmwProblem)
    formData.append('challengeRules', rules)
    formData.append('edital', pdfFile)

    formData.append('selectionCriteria', JSON.stringify(criteria))

    const response = await BuyMaterializationService.createMaterialization(challengeId, formData)

    console.log(response)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[24px] text-[#0B2B70] dark:text-white font-semibold mb-4">
          Materialização para Buy
        </h1>

      <div className="flex flex-col">
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
        <h1 className="flex gap-1 items-center text-[#0B2B70] dark:text-white font-semibold mb-1">
          Problema do Edital
        </h1>

        <div className="flex-1 flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
          <textarea  
            required
            rows={5}
            maxLength={2000}
            value={hmwProblem}
            onChange={(e) => setHmwProblem(e.target.value)}
            placeholder="Descreva o problema no formato HMW"
            className="w-full bg-transparent text-sm outline-none text-black/80 dark:text-white placeholder:text-[#98A2B3] dark:placeholder:text-white resize-none"
          />
        </div>
      </div>

      <div className="flex flex-col mb-4">
        <h1 className="flex gap-1 items-center text-[#0B2B70] dark:text-white font-semibold mb-1">
          Regras do Desafio
        </h1>

        <div className="flex-1 flex items-center rounded-lg border px-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
          <textarea 
            required
            rows={5}
            maxLength={2000}
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            placeholder="Quais são as regras de negócio?"
            className="w-full bg-transparent text-sm outline-none text-black/80 dark:text-white placeholder:text-[#98A2B3] dark:placeholder:text-white resize-none"
          />
        </div>
      </div>

      <div className="flex flex-col mb-4">
        <h1 className="flex gap-1 items-center text-[#0B2B70] dark:text-white font-semibold mb-1">
          Critérios de Seleção do desafio
        </h1>

        <div className="flex items-center gap-2">
          <div 
            className="flex items-center bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors
            text-[#0B2B70] font-semibold text-[14px] rounded-[8px] relative"
          >
            <input
              type="text"
              value={criterion}
              onChange={(e) => setCriterion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCriterion();
                }
              }}
              placeholder="Digite um critério de seleção"
              className="flex w-fit justify-center p-2
              bg-transparent cursor-text rounded-[8px] outline-none"
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
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}