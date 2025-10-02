'use client';

import type { DndContextProps } from '@dnd-kit/core';
import {
  DndContext,
  useDroppable,
} from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext,
} from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type KanbanItemProps = {
  id: string;
  name: string;
  column: string;
} & Record<string, unknown>;

type KanbanColumnProps = {
  id: string;
  name: string;
} & Record<string, unknown>;

type KanbanContextProps<
  T extends KanbanItemProps = KanbanItemProps,
  C extends KanbanColumnProps = KanbanColumnProps,
> = {
  columns: C[];
  data: T[];
};

const KanbanContext = createContext<KanbanContextProps>({
  columns: [],
  data: [],
});

export type KanbanBoardProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

export const KanbanBoard = ({ id, children, className }: KanbanBoardProps) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div
      className={cn(
        'flex w-[280px] flex-col rounded-[8px] flex-shrink-0', 
        'bg-[#15358D] dark:bg-[#1a2844] text-xs shadow-sm border border-gray-200 dark:border-gray-800',
        className
      )}
      ref={setNodeRef}
    >
      {children}
    </div>
  );
};

export type KanbanCardProps<T extends KanbanItemProps = KanbanItemProps> = T & {
  children?: ReactNode;
  className?: string;
};

export const KanbanCard = <T extends KanbanItemProps = KanbanItemProps>({
  id,
  children,
  className,
}: KanbanCardProps<T>) => {
  const {
    attributes,
    setNodeRef,
    transition,
    transform,
  } = useSortable({
    id,
    disabled: false,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div style={style} {...attributes} ref={setNodeRef}>
      <Card
        className={cn(
          'gap-4 rounded-[8px] bg-[#fff] p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900',
          className
        )}
      >
        {children}
      </Card>
    </div>
  );
};


export type KanbanCardsProps<T extends KanbanItemProps = KanbanItemProps> =
  Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'id'> & {
    children: (item: T) => ReactNode;
    id: string;
  };


export const KanbanCards = <T extends KanbanItemProps = KanbanItemProps>({
  children,
  className,
  ...props
}: KanbanCardsProps<T>) => {
  const { data } = useContext(KanbanContext) as KanbanContextProps<T>;
  const filteredData = data.filter((item) => item.column === props.id);
  const items = filteredData.map((item) => item.id);

  return (
    <div className='overflow-hidden'>
      <ScrollArea className="max-h-[74vh] overflow-y-auto scrollbar-hidden">
        <SortableContext items={items}>
          <div
            className={cn(`flex flex-grow flex-col gap-2 ${filteredData.length === 0 ? "px-3 py-2" : "p-2"}`, className)}
            {...props}
          >
            {filteredData.length === 0 ? (
              <div>
                <p className='text-white/40 font-semibold text-sm'>Aguardando processo...</p>
              </div>
            ) : (
              filteredData.map(children)
            )}
          </div>
        </SortableContext>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};


export type KanbanHeaderProps = HTMLAttributes<HTMLDivElement>;

export const KanbanHeader = ({ className, children, ...props }: KanbanHeaderProps) => (
  <div
    className={cn('m-0 p-2 font-semibold text-base text-white', className)}
    {...props}
  >
    {children}
    <div className="h-[1.5px] w-[98%] bg-white/50 mt-2 rounded-full mx-auto" />
  </div>
);

export type KanbanProviderProps<
  T extends KanbanItemProps = KanbanItemProps,
  C extends KanbanColumnProps = KanbanColumnProps,
> = Omit<DndContextProps, 'children'> & {
  children: (column: C) => ReactNode;
  className?: string;
  columns: C[];
  data: T[];
  onDataChange?: (data: T[]) => void;
};

export const KanbanProvider = <
  T extends KanbanItemProps = KanbanItemProps,
  C extends KanbanColumnProps = KanbanColumnProps,
>({
  children,
  className,
  columns,
  data,
  ...props
}: KanbanProviderProps<T, C>) => {
  
  return (
    <KanbanContext.Provider value={{ columns, data }}>
      <DndContext {...props}>
        <div
          className={cn(
            'grid grid-flow-col auto-cols-[280px] items-start gap-4 overflow-x-auto scrollbar-hidden',
            className
          )}  
        >
          {columns.map((column) => children(column))}
        </div>
      </DndContext>
    </KanbanContext.Provider>
  );
};