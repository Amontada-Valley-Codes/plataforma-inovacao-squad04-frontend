import { CardContentsHeader } from "./CardsContents"
import { Target, ClipboardList, Users, ChartNoAxesCombined } from "lucide-react"

type CardExperimentationContentProps = {
  challangeTitle: string;
  category: string;
  description: string;
  startDate: string;
  endDate: string;
  creator: string;
  visibility: string;
}

export const Experimentation = ({ challangeTitle, category, startDate, endDate, creator, visibility }: CardExperimentationContentProps) => {
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
          className="w-full bg-transparent outline-none resize-none overflow-y-auto"
          placeholder="Qual o objetivo?"
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
              className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
            />
          </div>
        </div>
        <div className="flex gap-4 text-sm items-center">
          <div className="flex-1 flex items-center rounded-lg border p-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
            <input 
              type="text" 
              placeholder="Prazo"
              className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
            />
          </div>
        </div>
        <div className="flex gap-4 text-sm items-center">
          <div className="flex-1 flex items-center rounded-lg border p-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
            <input 
              type="text" 
              placeholder="Ambiente de Teste"
              className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
            />
          </div>
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-1 mb-6">
      <h1 className="flex gap-1 items-center text-black text-lg">
        <ChartNoAxesCombined size={16}/>
        KPIs de Sucesso
      </h1>
      <div className="flex flex-col text-sm">
        <div className="flex w-3/4 justify-between">
          <p>Taxa de Conclusão</p>
          <p>90% dos Usuários</p>
        </div>
        <div className="flex w-3/4 justify-between">
          <p>Tempo Médio de Entrega</p>
          <p>≤ 2 Dias</p>
        </div>
        <div className="flex w-3/4 justify-between">
          <p>Satisfação do usuário</p>
          <p>≥ 4,5 de 5</p>
        </div>
      </div>
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
  </div>
 )
}