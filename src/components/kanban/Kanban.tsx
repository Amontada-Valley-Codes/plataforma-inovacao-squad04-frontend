'use client';

import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@/components/ui/shadcn-io/kanban';
import { useEffect, useState } from 'react';
import { CalendarClock, Tag } from 'lucide-react';
import CardExpanded from './CardExpanded';
import ForwardButton from './ForwardButton';
import PreviousButton from './PreviousButton';
import { ShowAllChallengeResponse } from '@/api/payloads/challenge.payload';
import { ChallengeService } from '@/api/services/challenge.service';

const columns = [
  { id: 'GENERATION', name: 'Desafios' },
  { id: 'PRE_SCREENING', name: 'Pré-Triagem' },
  { id: 'DETAILED_SCREENING', name: 'Triagem Detalhada' },
  { id: 'IDEATION', name: 'Ideação' },
  { id: 'EXPERIMENTATION', name: 'Experimentação' },
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
    case 'TECHNOLOGY':
      return 'TECNOLOGIA';
    case 'HEALTH':
      return 'SAÚDE';
    case 'EDUCATION':
      return 'EDUCAÇÃO';
    case 'ENVIRONMENT':
      return 'MEIO AMBIENTE';
    case 'BUSINESS':
      return 'NEGÓCIOS';
    case 'SOCIAL':
      return 'SOCIAL';
    case 'ENGINEERING':
      return 'ENGENHARIA';
    case 'AGRICULTURE':
      return 'AGRICULTURA';
    case 'DESIGN':
      return 'DESIGN';
    case 'OTHER':
    default:
      return 'OUTRO';
  }
};

export type Challenge = ShowAllChallengeResponse

const KanbanPage = () => {
  const [challanges, setChallanges] = useState<Challenge[]>([]);

  useEffect(() => {
    async function fetchChallanges() {
      const response = await ChallengeService.showAllChallenges()
      setChallanges(response)
    }

    fetchChallanges()
  }, [])  

  const [expandedCard, setExpandedCard] = useState<Challenge | null>(null)

  const handleApproveAndMove = (challangeId: string | undefined) => {
    const challengeToMove = challanges?.find(c => c.id === challangeId);
    if (!challengeToMove) return;

    const currentColumnIndex = columns.findIndex(c => c.id === challengeToMove.status);

    if (currentColumnIndex < columns.length - 1) {
      const nextColumn = columns[currentColumnIndex + 1];

      if (nextColumn.id === "IDEATION") {
        setExpandedCard(challengeToMove)
      } else {
        const updatedChallenge = { ...challengeToMove, status: nextColumn.id };
        const otherChallenges = challanges?.filter(c => c.id !== challangeId);
        const newChallenges = [updatedChallenge, ...otherChallenges];
        setChallanges(newChallenges);
      }
    }
  };

  const handleMoveBack = (challengeId: string | undefined) => {
    const cardToMove = challanges?.find(c => c.id === challengeId);
    if (!cardToMove) return;

    const currentColumnIndex = columns.findIndex(c => c.id === cardToMove.status);

    if (currentColumnIndex > 0) {
      const prevColumn = columns[currentColumnIndex - 1];
      const updatedChallenges = { ...cardToMove, status: prevColumn.id };
      const otherChallenges = challanges?.filter(c => c.id !== challengeId);
      const newChallenges = [updatedChallenges, ...otherChallenges];
      setChallanges(newChallenges);
    }
  };

  return (
    <div className='w-full h-full'>
      <div>
        <KanbanProvider
          columns={columns}
          data={challanges}
          onDataChange={setChallanges}
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
                                {getCategoryLabel(challenge.area)}
                              </p>
                            </div>
                            <p className="flex items-center gap-1 m-0 font-semibold text-[#666] dark:text-[#ced3db] text-[12px] mt-1">
                              <CalendarClock size={14}/>
                              {shortDateFormatter.format(new Date(challenge.startDate))} -{' '}
                              {dateFormatter.format(new Date(challenge.endDate))}
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
      <CardExpanded
        isOpen={!!expandedCard}
        onClose={() => setExpandedCard(null)}
        cardData={expandedCard}
        columns={columns}
        challenges={challanges}
        setChallenges={setChallanges}
        setExpandedCard={setExpandedCard}
      />
    </div>
  );
};

export default KanbanPage;