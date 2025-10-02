'use client';

import { fakerPT_BR as faker } from '@faker-js/faker';
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@/components/ui/shadcn-io/kanban';
import { useState } from 'react';
import { CalendarClock, Tag, Send } from 'lucide-react';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const columns = [
  { id: faker.string.uuid(), name: 'Desafios' },
  { id: faker.string.uuid(), name: 'Pré-Triagem' },
  { id: faker.string.uuid(), name: 'Ideação' },
  { id: faker.string.uuid(), name: 'Triagem Detalhada' },
  { id: faker.string.uuid(), name: 'Experimentação' },
];

const users = Array.from({ length: 4 })
  .fill(null)
  .map(() => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    image: faker.image.avatar(),
  }));

type Feature = {
    id: string;
    name: string;
    category: string;
    startAt: Date;
    endAt: Date;
    description: string;
    column: string;
    owner: { id: string; name: string; image: string };
};

const exampleFeatures: Feature[] = Array.from({ length: 6 })
  .fill(null)
  .map(() => ({
    id: faker.string.uuid(),
    name: capitalize(faker.company.buzzPhrase()),
    category: faker.commerce.department(),
    startAt: faker.date.past({ years: 0.5, refDate: new Date() }),
    endAt: faker.date.future({ years: 0.5, refDate: new Date() }),
    description: faker.hacker.phrase(),
    column: columns[0].id,
    owner: faker.helpers.arrayElement(users),
  }));

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'numeric',
  day: 'numeric',
  year: 'numeric',
});
const shortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'numeric',
  day: 'numeric',
});

const KanbanPage = () => {
  const [features, setFeatures] = useState(exampleFeatures);

  const handleApproveAndMove = (featureId: string) => {
    const featureToMove = features.find(f => f.id === featureId);
    if (!featureToMove) return;

    const currentColumnIndex = columns.findIndex(c => c.id === featureToMove.column);

    if (currentColumnIndex < columns.length - 1) {
      const nextColumn = columns[currentColumnIndex + 1];
      const updatedFeature = { ...featureToMove, column: nextColumn.id };
      const otherFeatures = features.filter(f => f.id !== featureId);
      const newFeatures = [updatedFeature, ...otherFeatures];
      setFeatures(newFeatures);
    }
  };

  return (
    <div className='w-full h-full'>
      <KanbanProvider
        columns={columns}
        data={features}
      >
        {(column) => {
          const isLastColumn = columns.findIndex(c => c.id === column.id) === columns.length - 1;
          
          return (
            <KanbanBoard id={column.id} key={column.id}>
              <KanbanHeader>{column.name}</KanbanHeader>
              <KanbanCards id={column.id}>
                {(feature: Feature) => (
                  <KanbanCard
                    id={feature.id}
                    key={feature.id}
                    name={feature.name}
                    column={column.id}
                  >
                    <div className="flex flex-col gap-3">
                      
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col">
                          <p className="m-0 flex-1 font-semibold text-[#0B2B70] text-base dark:text-blue-800">
                            {feature.name}
                          </p>
                          <div className='flex gap-1 mt-1'>
                            <p className='flex items-center gap-1 m-0 font-semibold dark:text-[#ced3db] text-neutral-700 text-[12px]'>
                              <Tag size={14} className='text-white dark:text-[#ced3db] fill-neutral-700'/>
                              {feature.category}
                            </p>
                          </div>
                          <p className="flex items-center gap-1 m-0 font-semibold text-[#666] dark:text-[#ced3db] text-[12px] mt-1">
                            <CalendarClock size={14}/>
                            {shortDateFormatter.format(feature.startAt)} -{' '}
                            {dateFormatter.format(feature.endAt)}
                          </p>
                        </div>
                      </div>
                      
                      {!isLastColumn && (
                        <div className='flex items-center justify-end'>
                          <button
                            className="flex w-1/3 justify-center px-2 py-1 
                            rounded-[8px] bg-[#0B2B70] hover:bg-[#09245e] transition-colors text-white font-semibold
                            text-[12px] cursor-pointer"
                            onClick={() => handleApproveAndMove(feature.id)}
                          >
                            Avançar
                          </button>
                        </div>
                      )}
                    </div>
                  </KanbanCard>
                )}
              </KanbanCards>
            </KanbanBoard>
          );
        }}
      </KanbanProvider>
    </div>
  );
};

export default KanbanPage;