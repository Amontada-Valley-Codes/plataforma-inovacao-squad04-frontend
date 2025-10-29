"use client"
import { useEffect, useState } from "react";
import { CardContentsHeader, Rating } from "./CardsContents"
import { Target, ClipboardList, Users, ChartNoAxesCombined, ClipboardPen, Trash2, X, Check, Loader2 } from "lucide-react"
import { ShowExperimentationResponse, UpdateExperimentationPayload, CreateExperimentationPayload } from "@/api/payloads/experimentation.payload";
import { experimentationService } from "@/api/services/experimentation.service";
import { kpisService } from "@/api/services/kpi.service";

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
  responsible: [],
  challengeId: cId,
  usersId: '',
  Kpis: []
});

export const Experimentation = ({ challangeTitle, challengeId, category, startDate, endDate, creator, visibility }: CardExperimentationContentProps) => {
  const [experimentation, setExperimentation] = useState<ShowExperimentationResponse>()
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kpis, setKpis] = useState<ShowExperimentationResponse['Kpis']>([])
  const [isAdding, setIsAdding] = useState(false)
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [editingKpiId, setEditingKpiId] = useState<string | null>(null);
  const [editingKpiName, setEditingKpiName] = useState('');
  const [editingKpiTarget, setEditingKpiTarget] = useState('');
 
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
      const newKpi = await kpisService.createKpi(experimentationId, { name: newName, target: newTarget })
      setKpis((prev) => [...prev, newKpi])
      setName('') 
      setTarget('')
    } catch (error) {
      console.error(error)
    }
  }

  const updateKpi = async (kpiId: string, newName: string, newTarget: string) => {
    if (!newName.trim() || !newTarget.trim()) {
      alert("Nome e Meta do KPI não podem estar vazios.");
      return;
    }

    try {
      await kpisService.updateKpi(kpiId, { name: newName, target: newTarget });
      
      setKpis(prevKpis => 
        prevKpis.map(kpi => 
          kpi.id === kpiId ? { ...kpi, name: newName, target: newTarget } : kpi
        )
      );
      
      setEditingKpiId(null);
      setEditingKpiName('');
      setEditingKpiTarget('');

    } catch (error) {
      console.error("Falha ao atualizar KPI:", error);
    }
  };

  const handleDeleteKpi = async (kpiId: string) => {
    
    if (!window.confirm("Tem certeza que deseja excluir este KPI?")) {
      return;
    }

    try {
      await kpisService.deleteKpi(kpiId);
      setKpis(prevKpis => prevKpis.filter(kpi => kpi.id !== kpiId));
    } catch (error) {
      console.error("Falha ao deletar KPI:", error);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, kpiId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      updateKpi(kpiId, editingKpiName, editingKpiTarget);
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setEditingKpiId(null);
    }
  };

  const handleChangeResponsible = (field: 'empresa' | 'startup', value: string) => {
    setExperimentation(prev => {
      const currentResponsible = prev?.responsible?.[0] || { empresa: '', startup: '' };
      const updatedResponsible = { ...currentResponsible, [field]: value };
      
      return {
        ...(prev || getDefaultForExperimentation(challengeId)),
        responsible: [updatedResponsible]
      };
    });
  };

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

    const kpisSalvos = kpis
    
    const payload: UpdateExperimentationPayload | CreateExperimentationPayload = {
      objective: experimentation.objective,
      testEnvironment: experimentation.testEnvironment,
      deadline: experimentation.deadline,
      maturityLevel: experimentation.maturityLevel || 0,
      minDelivery: experimentation.minDelivery,
      responsible: experimentation.responsible
    };
 
    try {
      if (experimentation.id) {
        const updatedResponse = await experimentationService.updateExperimentation(challengeId, payload);
        
        const savedData: ShowExperimentationResponse = {
          ...updatedResponse,
          Kpis: kpisSalvos
        };
        setExperimentation(savedData);
        setKpis(kpisSalvos);

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

  if (error) {
    return <div className="w-full justify-center items-center h-full">
      {error}
    </div>
  }

  if (isLoading) {
    return <div className="w-full justify-center items-center h-full animate-spin">
      <Loader2 size={24}/>
    </div>
  }

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
                value={experimentation?.minDelivery ?? ""}
                onChange={(e) => handleChange("minDelivery", e.target.value)}
                className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
              />
            </div>
          </div>
          <div className="flex gap-4 text-sm items-center">
            <div className="flex-1 flex items-center rounded-lg border p-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
              <input 
                type="date" 
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
            
            {kpis?.map((kpi) => {
              const isEditing = editingKpiId === kpi.id;

              return (
                <div key={kpi.id} className="flex gap-2 w-full items-center">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={editingKpiName}
                        onChange={(e) => setEditingKpiName(e.target.value)}
                        onKeyDown={(e) => handleEditKeyDown(e, kpi.id)}
                        className="w-2/3 p-2 border rounded bg-white border-blue-500 shadow-sm"
                        autoFocus
                      />
                      <input
                        type="text"
                        value={editingKpiTarget}
                        onChange={(e) => setEditingKpiTarget(e.target.value)}
                        onKeyDown={(e) => handleEditKeyDown(e, kpi.id)}
                        className="w-1/3 p-2 border rounded bg-white border-blue-500 shadow-sm"
                      />
                      <button 
                        onClick={() => updateKpi(kpi.id, editingKpiName, editingKpiTarget)} 
                        className="p-2 text-green-600 hover:text-green-800" 
                        title="Salvar"
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        onClick={() => setEditingKpiId(null)} 
                        className="p-2 text-gray-600 hover:text-gray-800" 
                        title="Cancelar"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="w-2/3 p-2 text-gray-700">{kpi.name}</span>
                      <span className="w-1/3 p-2 text-gray-700 font-medium">{kpi.target}</span>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingKpiId(kpi.id);
                          setEditingKpiName(kpi.name);
                          setEditingKpiTarget(kpi.target);
                        }} 
                        className="p-2 text-[#0B2B72] hover:text-[#0b245a] transition-all" 
                        title="Editar KPI"
                      >
                        <ClipboardPen size={16} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteKpi(kpi.id);
                        }} 
                        className="p-2 text-red-600 hover:text-red-800 transition-all"
                        title="Excluir KPI"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              )
            })}
            
            {isAdding && experimentation?.id ? (
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  placeholder="Nome do novo KPI"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-2/3 p-2 border rounded bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900"
                />
                <input
                  type="text"
                  placeholder="Meta"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-1/fs-3 p-2 border rounded bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900"
                />
                <button
                  onClick={() => {
                    if (experimentation.id) {
                      addItem(experimentation.id, name, target)
                    }
                  }}
                  className="flex items-center gap-1 px-2 py-1.5 text-sm rounded-[8px] text-[#666] bg-[#E2E2E2] hover:bg-gray-300 transition"
                >
                  Adicionar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                disabled={!experimentation?.id || editingKpiId !== null}
                className="flex w-fit items-center gap-1 px-3 py-1.5 text-sm text-[#666] bg-[#E2E2E2] hover:bg-gray-300 rounded-[8px] transition mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
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