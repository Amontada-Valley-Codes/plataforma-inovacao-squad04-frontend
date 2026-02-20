import { BuyMaterializationService } from "@/api/services/buy-materialization.service";
import { Check, Plus, Trash2 } from "lucide-react";
import React, { useState, useEffect, Dispatch, SetStateAction } from "react"

type MakeForBuyProps = {
  challengeId: string
  buyId: string
  setBuyId: Dispatch<SetStateAction<string>>
  criteria: string[]
  setCriteria: Dispatch<SetStateAction<string[]>>
  pdfFile: File | null
  setPdfFile: Dispatch<SetStateAction<File | null>>
  hmwProblem: string
  setHmwProblem: Dispatch<SetStateAction<string>>
  rules: string
  setRules: Dispatch<SetStateAction<string>>
}

export default function MakeforBuy({ 
  challengeId,
  buyId,
  criteria,
  hmwProblem,
  pdfFile,
  rules,
  setBuyId,
  setCriteria,
  setHmwProblem,
  setPdfFile,
  setRules,
}: MakeForBuyProps) {
  const [criterion, setCriterion] = useState<string>('');
  const [existingFileUrl, setExistingFileUrl] = useState<string>('');

  useEffect(() => {
    async function fetchBuy() {
      try {
        const response = await BuyMaterializationService.ShowBuys();
        const found = response.find(item => item.challengeId === challengeId);

        if (found) {
          setBuyId(found.id);
          setHmwProblem(found.hmwProblem);
          setRules(found.challengeRules);
          setCriteria(found.selectionCriteria || []);
          
          if (found.editalFileUrl?.files?.[0]?.url) {
            setExistingFileUrl(found.editalFileUrl.files[0].url);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchBuy();
  }, [challengeId]);

  const addCriterion = () => {
    if (!criterion.trim()) return
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
  const hasExisting = Boolean(existingFileUrl && !pdfFile);
  
  let label = "Upload do Edital do desafio";
  if (hasFile) label = pdfFile!.name;
  else if (hasExisting) label = "Edital já anexado (Clique para alterar)";
  
  const Icon = (hasFile || hasExisting) ? Check : Plus

  return (
    <div className="bg-white dark:bg-black rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[24px] text-[#0B2B70] dark:text-white font-semibold">
          Materialização para Buy
        </h1>

        <div className="flex flex-col">
          <label
            className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all
              ${(hasFile || hasExisting) ? 'bg-green-600' : 'bg-[#0B2B70]'} 
              text-white font-medium text-sm hover:opacity-90`}
          >
            <Icon size={18}/>
            <span className="max-w-[200px] truncate">{label}</span>

            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handlePdfUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col mb-6">
        <h1 className="flex gap-1 items-center justify-between text-[#0B2B70] dark:text-white font-semibold mb-2">
          <span>Problema do Edital</span>
        </h1>

        <div className="flex-1 flex rounded-lg border px-3 py-2 min-h-[120px] transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900 focus-within:border-[#0B2B70]">
          <textarea  
            required
            rows={5}
            maxLength={2000}
            value={hmwProblem}
            onChange={(e) => setHmwProblem(e.target.value)}
            placeholder="Descreva o problema no formato HMW"
            className="w-full h-full bg-transparent text-sm outline-none text-black/80 dark:text-white placeholder:text-[#98A2B3] dark:placeholder:text-gray-500 resize-none"
          />
        </div>
      </div>

      <div className="flex flex-col mb-6">
        <h1 className="flex gap-1 items-center text-[#0B2B70] dark:text-white font-semibold mb-2">
          Regras do Desafio
        </h1>

        <div className="flex-1 flex rounded-lg border px-3 py-2 min-h-[120px] transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900 focus-within:border-[#0B2B70]">
          <textarea 
            required
            rows={5}
            maxLength={2000}
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            placeholder="Quais são as regras de negócio?"
            className="w-full h-full bg-transparent text-sm outline-none text-black/80 dark:text-white placeholder:text-[#98A2B3] dark:placeholder:text-gray-500 resize-none"
          />
        </div>
      </div>

      <div className="flex flex-col mb-8">
        <h1 className="flex gap-1 items-center text-[#0B2B70] dark:text-white font-semibold mb-2">
          Critérios de Seleção do desafio
        </h1>

        <div className="flex items-center gap-2">
          <div 
            className="flex items-center bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors
            text-[#0B2B70] font-semibold text-[14px] rounded-[8px] flex-1 max-w-md border border-transparent focus-within:border-[#0B2B70]"
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
              className="w-full p-2 bg-transparent cursor-text rounded-[8px] outline-none placeholder:text-[#0B2B70]/50"
            />
          </div>

          <button
            type="button"
            onClick={addCriterion}
            disabled={!criterion}
            className="flex items-center gap-1 px-4 py-2
            bg-[#0B2B70] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            <Plus size={16} />
            Adicionar
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3 min-h-[40px]">
          {criteria.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 bg-[#E7EEFF] text-[#0B2B70] border border-[#0B2B70]/10 px-3 py-1 rounded-full text-sm font-medium"
            >
              {item.replaceAll("_", " ")}

              <button
                type="button"
                onClick={() => removeCriterion(item)}
                className="hover:text-red-500 transition-colors"
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