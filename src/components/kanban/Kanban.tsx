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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const columns = [
  { id: faker.string.uuid(), name: 'Desafios', color: '#6B7280' },
  { id: faker.string.uuid(), name: 'Pré-Triagem', color: '#F59E0B' },
  { id: faker.string.uuid(), name: 'Ideação'},
  { id: faker.string.uuid(), name: 'Triagem Detalhada'},
  { id: faker.string.uuid(), name: 'Experimentação'}
];
const users = Array.from({ length: 4 })
  .fill(null)
  .map(() => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    image: faker.image.avatar(),
  }));
const exampleFeatures = Array.from({ length: 20 })
  .fill(null)
  .map(() => ({
    id: faker.string.uuid(),
    name: capitalize(faker.company.buzzPhrase()),
    category: faker.commerce.department(),
    startAt: faker.date.past({ years: 0.5, refDate: new Date() }),
    endAt: faker.date.future({ years: 0.5, refDate: new Date() }),
    description: faker.hacker.phrase(),
    column: faker.helpers.arrayElement(columns).id,
    owner: faker.helpers.arrayElement(users),
  }));
const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
  day: 'numeric',
});
const shortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
  day: 'numeric',
});
const Kanban = () => {
  const [features, setFeatures] = useState(exampleFeatures);
  return (
    <KanbanProvider
      columns={columns}
      data={features}
      onDataChange={setFeatures}
    >
      {(column) => (
        <KanbanBoard id={column.id} key={column.id}>
          <KanbanHeader>
            <div className="flex items-center gap-2">
              <span>{column.name}</span>
            </div>
          </KanbanHeader>
          <KanbanCards id={column.id}>
            {(feature: (typeof features)[number]) => (
              <KanbanCard
                column={column.id}
                id={feature.id}
                key={feature.id}
                name={feature.name}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <p className="m-0 flex-1 font-semibold text-[#0B2B70] text-base">
                      {feature.name}
                    </p>
                    <p className="m-0 flex-1 font-semibold text-[#666] text-sm">
                      {feature.owner.name}
                    </p>
                    <div className='flex gap-1'>
                      <p className='m-0 font-semibold text-[#666] text-[12px]'>
                        {feature.category}
                      </p>
                      <p className="m-0 font-semibold text-[#666] text-[12px]">
                        {shortDateFormatter.format(feature.startAt)} -{' '}
                        {dateFormatter.format(feature.endAt)}
                      </p>
                    </div>  
                  </div>
                  {feature.owner && (
                    <Avatar className="h-6 w-6 shrink-0">
                      <AvatarImage src={feature.owner.image} />
                      <AvatarFallback>
                        {feature.owner.name?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div> 
                <div className='font-medium text-[12px] text-zinc-800'>
                  {feature.description}
                </div>
              </KanbanCard>
            )}
          </KanbanCards>
        </KanbanBoard>
      )}
    </KanbanProvider>
  );
};
export default Kanban;