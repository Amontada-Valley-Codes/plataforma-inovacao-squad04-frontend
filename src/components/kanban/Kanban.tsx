'use client';

import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@/components/ui/shadcn-io/kanban';
import { useEffect, useState } from 'react';
import { CalendarClock, ChevronDown, Search, SquareKanban, TableProperties, Tag } from 'lucide-react';
import CardExpanded from './CardExpanded';
import ForwardButton from './ForwardButton';
import PreviousButton from './PreviousButton';
import { ShowAllChallengeResponse } from '@/api/payloads/challenge.payload';
import { ChallengeService } from '@/api/services/challenge.service';
import KanbanTable from './KanbanTable';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import next from 'next';

const columns = [
  { id: 'GENERATION', name: 'Desafios' },
  { id: 'PRE_SCREENING', name: 'Pré-Triagem' },
  { id: 'DETAILED_SCREENING', name: 'Triagem Detalhada' },
  { id: 'MATERIALIZATION', name: 'Materialização' },
  { id: 'EXPERIMENTATION', name: 'Experimentação' },
  { id: 'SCALE', name: 'Escala' }
];

export const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'numeric',
  day: 'numeric',
  year: 'numeric',
});
export const shortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'numeric',
  day: 'numeric',
});

export const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'ADMINISTRATIVE':
      return 'ADMINISTRATIVO';
    case 'FINANCIAL':
      return 'FINANCEIRO';
    case 'ACCOUNTING':
      return 'CONTÁBIL';
    case 'LEGAL':
      return 'JURÍDICO';
    case 'HUMAN_RESOURCES':
      return 'RECURSOS HUMANOS';
    case 'MARKETING':
      return 'MARKETING';
    case 'SALES':
      return 'VENDAS';
    case 'COMMERCIAL':
      return 'COMERCIAL';
    case 'SUPPLY':
      return 'SUPRIMENTOS';
    case 'LOGISTICS':
      return 'LOGÍSTICA';
    case 'PRODUCTION':
      return 'PRODUÇÃO';
    case 'TECHNOLOGY':
      return 'TECNOLOGIA';
    case 'ENGINEERING':
      return 'ENGENHARIA';
    case 'CUSTOMER_SERVICE':
      return 'ATENDIMENTO AO CLIENTE';
    case 'QUALITY':
      return 'QUALIDADE';
    case 'RESEARCH_DEVELOPMENT':
      return 'PESQUISA E DESENVOLVIMENTO';
    case 'HEALTH_SAFETY':
      return 'SAÚDE E SEGURANÇA';
    case 'OTHER':
    default:
      return 'OUTRO';
  }
};

export type Challenge = ShowAllChallengeResponse

const KanbanPage = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isKanban, setIsKanban] = useState(true)
  const [expandedCard, setExpandedCard] = useState<Challenge | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [areaFilter, setAreaFilter] = useState<string | undefined>()
  const searchParams = useSearchParams();
  const [isOpenStatus, setIsOpenStatus] = useState(false)
  const [isOpenArea, setIsOpenArea] = useState(false)

  useEffect(() => {
    async function fetchChallenges() {
      const response = await ChallengeService.showAllChallenges()
      setChallenges(response)
      console.log(response)
    }

    fetchChallenges()
  }, [])

  const refetchChallenges = async () => {
    const response = await ChallengeService.showAllChallenges()
    setChallenges(response)
  }  

  useEffect(() => {
    const challengeId = searchParams.get('challengeId');
    if (challengeId && challenges.length > 0) {
      const challenge = challenges.find(c => c.id === challengeId);
      if (challenge) {
        setExpandedCard(challenge);
      }
    }
  }, [searchParams, challenges]);

  const handleApproveAndMove = async (challengeId: string | undefined) => {
    const challengeToMove = challenges?.find(c => c.id === challengeId);
    if (!challengeToMove) return;

    const currentColumnIndex = columns.findIndex(c => c.id === challengeToMove.status);

    if (currentColumnIndex < columns.length - 1) {
      const nextColumn = columns[currentColumnIndex + 1];

      try {
        if (challengeId) {
          // await ChallengeService.changeStatus(challengeId, { status: nextColumn.id })
          await ChallengeService.advanceStage(challengeId, { status: nextColumn.id });
        }

        const updatedChallenge = { ...challengeToMove, status: nextColumn.id };
        const otherChallenges = challenges?.filter(c => c.id !== challengeId);
        setChallenges([updatedChallenge, ...otherChallenges]);

        toast.success("Desafio avançado com sucesso.")

      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Não foi possível avançar o desafio.")
      }
    }
  };

  const handleMoveBack = async (challengeId: string | undefined) => {
    const cardToMove = challenges?.find(c => c.id === challengeId);
    if (!cardToMove) return;

    const currentColumnIndex = columns.findIndex(c => c.id === cardToMove.status);

    if (currentColumnIndex > 0) {
      const prevColumn = columns[currentColumnIndex - 1];

      try {
        if (challengeId) {
          // await ChallengeService.changeStatus(challengeId, { status: prevColumn.id })
          await ChallengeService.returnStep(challengeId, { status: prevColumn.id });
        }

        const updatedChallenge = { ...cardToMove, status: prevColumn.id };
        const otherChallenges = challenges?.filter(c => c.id !== challengeId);
        setChallenges([updatedChallenge, ...otherChallenges]);

        toast.success("Desafio retornado com sucesso.")

      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Não foi possível retornar o desafio.")
      }
    }
  };

  return (
    <div className='w-full h-full'>
      <div className={`flex flex-col md:flex-row md:items-center ${isKanban ? "justify-end" : "justify-between"} gap-2 mb-4`}>
        {!isKanban && (
          <div className='flex flex-col md:flex-row w-full md:w-auto gap-3 md:gap-4'>
            <div className="flex w-full md:w-[300px] lg:w-[360px] relative items-center rounded-lg border pl-12 pr-3 py-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
              <Search className='absolute left-3 text-[#98A2B3]' size={20}/>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar na tabela..." 
                className="w-full bg-transparent text-sm outline-none text-black/80 dark:text-white placeholder:text-[#98A2B3] resize-none"
              />
            </div>
            
            <div className='flex gap-3 w-full md:w-auto'>
              <div 
                  className="transition-colors border text-[#98A2B3] bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900
                  text-[14px] rounded-[8px] relative w-1/2 md:w-auto"
              >
                <select
                  onFocus={() => setIsOpenStatus(true)}
                  onBlur={() => setIsOpenStatus(false)}
                  value={statusFilter || ""}
                  onChange={(e) => setStatusFilter(e.target.value || undefined)}
                  className="flex w-full justify-center p-2 appearance-none
                  cursor-pointer rounded-[8px] outline-none pr-10"
                >
                  <option value="">Todos Status</option>
                  <option value="GENERATION">Desafios</option>
                  <option value="PRE_SCREENING">Pré-Triagem</option>
                  <option value="DETAILED_SCREENING">Triagem Detalhada</option>
                  <option value="MATERIALIZATION">Materialização</option>
                  <option value="EXPERIMENTATION">Experimentação</option>
                  <option value="SCALE">Escala</option>
                </select>
                <ChevronDown 
                  className={`text-[#98A2B3] absolute right-2 pointer-events-none
                              transition-transform duration-200 top-2
                              ${isOpenStatus ? "rotate-180" : "rotate-0"}`}
                />
              </div>

              <div 
                  className="transition-colors border text-[#98A2B3] bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900
                  text-[14px] rounded-[8px] relative w-1/2 md:w-auto"
              >
                <select
                  onFocus={() => setIsOpenArea(true)}
                  onBlur={() => setIsOpenArea(false)}
                  value={areaFilter || ""}
                  onChange={(e) => setAreaFilter(e.target.value || undefined)}
                  className="flex w-full justify-center p-2 appearance-none
                  cursor-pointer rounded-[8px] outline-none pr-10"
                >
                  <option value="">Todas áreas</option>
                  <option value="ADMINISTRATIVE">Administrativo</option>
                  <option value="FINANCIAL">Financeiro</option>
                  <option value="ACCOUNTING">Contábil</option>
                  <option value="LEGAL">Jurídico</option>
                  <option value="HUMAN_RESOURCES">Recursos Humanos</option>
                  <option value="MARKETING">Marketing</option>
                  <option value="SALES">Vendas</option>
                  <option value="COMMERCIAL">Comercial</option>
                  <option value="SUPPLY">Suprimentos</option>
                  <option value="LOGISTICS">Logística</option>
                  <option value="PRODUCTION">Produção</option>
                  <option value="TECHNOLOGY">Tecnologia</option>
                  <option value="ENGINEERING">Engenharia</option>
                  <option value="CUSTOMER_SERVICE">Atendimento ao Cliente</option>
                  <option value="QUALITY">Qualidade</option>
                  <option value="RESEARCH_DEVELOPMENT">Pesquisa e Desenvolvimento</option>
                  <option value="HEALTH_SAFETY">Saúde e Segurança</option>
                  <option value="OTHER">Outro</option>
                </select>
                <ChevronDown 
                  className={`text-[#98A2B3] absolute right-2 pointer-events-none
                              transition-transform duration-200 top-2
                              ${isOpenArea ? "rotate-180" : "rotate-0"}`}
                />
              </div>
            </div>
          </div>
        )}

        <div className='flex items-center gap-2 self-end md:self-auto'>
          <p className='text-sm text-gray-600 dark:text-white font-medium text-justify'>Visualizar como:</p>
          <button
            title={isKanban ? "Tabela" : "Funil"}
            onClick={() => setIsKanban(!isKanban)}
            className="flex w-fit justify-center p-2 text-[#0B2B70] font-semibold
            rounded-[4px] bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors
            text-[12px] cursor-pointer dark:bg-[#15358d] dark:text-white"
          >
            {isKanban ? <TableProperties size={18}/> : <SquareKanban size={18}/>}
          </button>
        </div>
      </div>

      {!isKanban && (
        <KanbanTable
          search={search}
          sector={areaFilter}
          status={statusFilter}
          onRowClick={setExpandedCard}
        />
      )}

      {isKanban && (
        <div>
          <KanbanProvider
            columns={columns}
            data={challenges}
            onDataChange={setChallenges}
            className='h-[calc(100vh-159px)]'
          >
            {(column) => {
              const isLastColumn = columns.findIndex(c => c.id === column.id) === columns.length - 1;
              const isFirstColumn = columns.findIndex(c => c.id === column.id) === 0
              
              return (
                <KanbanBoard id={column.id} key={column.id}>
                  <KanbanHeader>{column.name}</KanbanHeader>
                  <KanbanCards id={column.id}>
                    {(challenge: Challenge) => (
                      <KanbanCard
                        id={challenge.id}
                        key={challenge.id}
                        name={challenge.name}
                        status={column.id}
                      >
                        <div 
                          className="flex flex-col gap-3"
                          onClick={() => setExpandedCard(challenge)}
                        >
                          
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-col">
                              <p className="m-0 flex-1 font-semibold text-[#0B2B70] text-base dark:text-blue-800">
                                {challenge.name}
                              </p>
                              <div className='flex gap-1 mt-1'>
                                <p className='flex items-center gap-1 m-0 font-semibold dark:text-[#ced3db] text-neutral-700 text-[12px]'>
                                  <Tag size={14} className='text-white dark:text-[#ced3db] fill-neutral-700'/>
                                  {getCategoryLabel(challenge.involvedAreas[0])}
                                </p>
                              </div>
                              <p className="flex items-center gap-1 m-0 font-semibold text-[#666] dark:text-[#ced3db] text-[12px] mt-1">
                                <CalendarClock size={14}/>
                                {shortDateFormatter.format(new Date(challenge.createdAt))}
                              </p>
                            </div>
                          </div>
                          
                          <div className={`flex w-full ${
                            !isFirstColumn && !isLastColumn ?
                            "justify-between"
                            : isLastColumn ? "justify-start"
                            : "justify-end"
                          }`}>
                            {!isFirstColumn && (
                              <div onClick={(e) => e.stopPropagation()}>
                                <PreviousButton className='w-25' challengeId={challenge.id} handleMoveBack={handleMoveBack}/>
                              </div>
                            )}
                            {!isLastColumn && (
                              <div onClick={(e) => e.stopPropagation()}>
                                <ForwardButton className="w-25" challengeId={challenge.id} handleApproveAndMove={handleApproveAndMove}/>
                              </div>
                            )}  
                          </div>
                        </div>
                      </KanbanCard>
                    )}
                  </KanbanCards>
                </KanbanBoard>
              );
            }}
          </KanbanProvider>
        </div>
      )}
      <CardExpanded
        isOpen={!!expandedCard}
        onClose={() => setExpandedCard(null)}
        cardData={expandedCard}
        columns={columns}
        challenges={challenges}
        setChallenges={setChallenges}
        setExpandedCard={setExpandedCard}
        onStatusChange={refetchChallenges}
      />
    </div>
  );
};

export default KanbanPage;  