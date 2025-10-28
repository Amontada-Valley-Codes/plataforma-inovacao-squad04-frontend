"use client"
import { useEffect, useState } from "react";
import { CardContentsHeader, Rating } from "./CardsContents"
import { Target, ClipboardList, Users, ChartNoAxesCombined } from "lucide-react"
import { ShowExperimentationResponse, UpdateExperimentationPayload, CreateExperimentationPayload } from "@/api/payloads/experimentation.payload";
import { experimentationService } from "@/api/services/experimentation.service";

type CardExperimentationContentProps = {
  challangeTitle: string;
  challengeId: string
  category: string;
  description: string;
  startDate: string;
  endDate: string;
  creator: string;
  visibility: string;
}

const getDefaultForExperimentation = (cId: string): ShowExperimentationResponse => ({
  id: '',
  objective: '',
  minDelivery: '',
  deadline: '',
  testEnvironment: '',
  maturityLevel: 0,
  challengeId: cId,
  Kpis: []
});

export const Experimentation = ({ challangeTitle, challengeId, category, startDate, endDate, creator, visibility }: CardExperimentationContentProps) => {
  const [experimentation, setExperimentation] = useState<ShowExperimentationResponse>()
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kpis, setKpis] = useState<{ name: string; target: string; }[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
 
  useEffect(() => {
    async function fetchExperimentation() {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await experimentationService.showExperimentation(challengeId);

        setExperimentation(response); 
        setKpis(response?.Kpis || []);
        
      } catch (err: any) {
        console.error(err);

        if (err?.response?.status === 404) {
          setExperimentation(getDefaultForExperimentation(challengeId));
        } else {
          setError("Falha ao carregar os dados da experimentação.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchExperimentation()
  }, [challengeId])

  const addItem = async (experimentationId: string, newName: string, newTarget: string) => {
    if (!newName.trim() || !newTarget.trim()) return

    try {
      const newKpi = await experimentationService.createKPI(experimentationId, { name: newName, target: newTarget })
      setKpis((prev) => [...prev, newKpi])
      setName('') 
      setTarget('')
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange = (field: keyof UpdateExperimentationPayload, value: string) => {
    setExperimentation(prev => ({
      ...(prev || getDefaultForExperimentation(challengeId)), 
      [field]: value 
    }));
  };
  
  const handleSave = async () => {
    if (!experimentation) {
      console.log("Erro: Dados da experimentação não estão prontos.");
      return;
    }
    
    const payload: UpdateExperimentationPayload | CreateExperimentationPayload = {
      objective: experimentation.objective,
      testEnvironment: experimentation.testEnvironment,
      deadline: experimentation.deadline,
      maturityLevel: experimentation.maturityLevel || 0,
      minDelivery: experimentation.minDelivery
    };
 
    try {
      if (experimentation.id) {
        const updatedResponse = await experimentationService.updateExperimentation(challengeId, payload);
        
        const savedData: ShowExperimentationResponse = {
          ...updatedResponse,
          Kpis: experimentation.Kpis
        };
        setExperimentation(savedData);
        setKpis(savedData.Kpis || []);

      } else {
        const createdResponse = await experimentationService.createExperimentation(challengeId, payload);

        const savedData: ShowExperimentationResponse = {
          ...createdResponse,
          Kpis: []
        };

        setExperimentation(savedData);
        setKpis(savedData.Kpis);
      }
      
      console.log("Salvo com sucesso!");

    } catch (err: any) {
      console.error("Falha ao salvar as alterações:", err.response?.data || err.message);
    }
  };

  return (
    <div  className="w-full flex flex-col overflow-y-auto scrollbar-hidden">
      <CardContentsHeader
        challengeTitle={challangeTitle}
        category={category}
        startDate={startDate}
        endDate={endDate}
        creator={creator}
        visibility={visibility}
      />
      
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="flex gap-1 items-center text-black text-lg">
          <Target size={16}/>
          Objetivo
        </h1>
        <div className="flex items-center rounded-lg border p-2 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
          <textarea 
            className="w-full bg-transparent outline-none resize-none overflow-y-auto text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
            placeholder="Qual o objetivo?"
            value={experimentation?.objective}
            onChange={(e) => handleChange("objective", e.target.value)}
            rows={5}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1 mb-6">
        <h1 className="flex gap-1 items-center text-black text-lg">
          <ClipboardList size={16}/>
          Escopo Resumido
        </h1>
        <div className="w-full flex flex-col gap-2">
          <div className="flex gap-4 text-sm items-center">
            <div className="flex-1 flex items-center rounded-lg border p-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
              <input 
                type="text" 
                placeholder="Entrega Minima"
                value={experimentation?.minDelivery}
                onChange={(e) => handleChange("minDelivery", e.target.value)}
                className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
              />
            </div>
          </div>
          <div className="flex gap-4 text-sm items-center">
            <div className="flex-1 flex items-center rounded-lg border p-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
              <input 
                type="text" 
                placeholder="Prazo"
                value={experimentation?.deadline}
                onChange={(e) => handleChange("deadline", e.target.value)}
                className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
              />
            </div>
          </div>
          <div className="flex gap-4 text-sm items-center">
            <div className="flex-1 flex items-center rounded-lg border p-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
              <input 
                type="text" 
                placeholder="Ambiente de Teste"
                value={experimentation?.testEnvironment}
                onChange={(e) => handleChange("testEnvironment", e.target.value)}
                className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
              />
            </div>
          </div>
        </div>
        <h1 className="flex gap-1 items-center mt-1 text-black text-sm">
          Nível de Maturidade
        </h1>
        <Rating 
          className="mt-0"
          value={experimentation?.maturityLevel}
          onChange={(newMaturityLevel) => setExperimentation(prev => {
            return {
              ...(prev || getDefaultForExperimentation(challengeId)), 
              maturityLevel: newMaturityLevel
            }
          })}
        />
      </div>

      <div className="flex flex-col gap-1 mb-6">
        <h1 className="flex gap-1 items-center text-black text-lg">
          <ChartNoAxesCombined size={16}/>
          KPIs de Sucesso
        </h1>
        {experimentation?.id && (
          <div className="flex flex-col text-sm gap-2">
            {kpis?.map((kpi, i) => (
              <div key={i} className="flex gap-2 w-full">
                <input
                  type="text"
                  value={kpi.name}
                  className="w-2/3 p-2 border rounded bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900"
                />
                <input
                  type="text"
                  value={kpi.target}
                  className="w-1/3 p-2 border rounded bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900"
                />
              </div>
            ))}
            {isAdding && experimentation?.id ? (
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-2/3 p-2 border rounded bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900"
                />
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-1/3 p-2 border rounded bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900"
                />
                <button
                  onClick={() => {
                    addItem(experimentation?.id, name, target)
                    setIsAdding(false)
                  }}
                  className="flex items-center gap-1 px-2 py-1.5 text-sm rounded-[8px] text-[#666] bg-[#E2E2E2] hover:bg-gray-300 transition"
                >
                  Adicionar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                disabled={!experimentation?.id}
                className="flex w-fit items-center gap-1 px-3 py-1.5 text-sm text-[#666] bg-[#E2E2E2] hover:bg-gray-300 rounded-[8px] transition mt-2"
              >
                Adicionar KPI
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex w-full flex-col gap-1 mb-6">
        <h1 className="flex gap-1 items-center text-black text-lg">
          <Users size={16}/>
          Responsáveis
        </h1>
        <div className="flex w-full gap-16">
          <div className="flex w-full gap-4 text-sm items-center">
            <div className="flex-1 flex items-center rounded-lg border p-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
              <input 
                type="text" 
                placeholder="Empresa"
                className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
              />
            </div>
          </div>

          <div className="flex w-full gap-4 text-sm items-center">
            <div className="flex-1 flex items-center rounded-lg border p-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
              <input 
                type="text" 
                placeholder="Startup"
                className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        className="mt-4 px-4 py-2 bg-[#0B2B72] text-white rounded-md self-end"
        onClick={handleSave}
      >
        Salvar Alterações
      </button>
    </div>
  )
}