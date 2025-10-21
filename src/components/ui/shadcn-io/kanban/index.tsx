'use client';

import type {
  Announcements,
  DndContextProps,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
  pointerWithin
} from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import tunnel from 'tunnel-rat';

import { Card } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const t = tunnel();

export type { DragEndEvent } from '@dnd-kit/core';

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
  activeCardId: string | null;
};

const KanbanContext = createContext<KanbanContextProps>({
  columns: [],
  data: [],
  activeCardId: null,
});

// Componente da Coluna (Board)
export type KanbanBoardProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

export const KanbanBoard = ({ id, children, className }: KanbanBoardProps) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex w-[280px] flex-shrink-0 flex-col rounded-[8px]',
        'bg-[#15358D] dark:bg-[#1a2844] text-xs shadow-sm border border-gray-200 dark:border-gray-800',
        'transition-all',
        isOver ? '' : '',
        className
      )}
    >
      {children}
    </div>
  );
};

// Componente do Card
export type KanbanCardProps<T extends KanbanItemProps = KanbanItemProps> = T & {
  children?: ReactNode;
  className?: string;
};

export const KanbanCard = <T extends KanbanItemProps = KanbanItemProps>({
  id,
  name,
  children,
  className,
}: KanbanCardProps<T>) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id,
  });
  const { activeCardId } = useContext(KanbanContext) as KanbanContextProps;

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <>
      <div style={style} ref={setNodeRef} {...listeners} {...attributes}>
        <Card
          className={cn(
            'cursor-grab gap-4 rounded-[8px] bg-[#fff] p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900',
            isDragging && 'pointer-events-none cursor-grabbing opacity-30',
            className
          )}
        >
          {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
        </Card>
      </div>
      {activeCardId === id && (
        <t.In>
          <Card
            className={cn(
              'cursor-grabbing gap-4 rounded-[8px] bg-[#fff] p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900',
              'transition-all duration-150',
              className
            )}
          >
            {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
          </Card>
        </t.In>
      )}
    </>
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
    <div className="overflow-hidden">
      <ScrollArea className="max-h-[74vh] overflow-y-auto scrollbar-hidden">
        <SortableContext items={items}>
          <div
            className={cn(
              `flex flex-grow flex-col gap-2 ${filteredData.length === 0 ? 'px-3 py-2' : 'p-2'}`,
              className
            )}
            {...props}
          >
            {filteredData.length === 0 ? (
              <div>
                <p className="text-white/40 font-semibold text-sm">
                  Aguardando processo...
                </p>
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

export const KanbanHeader = ({
  className,
  children,
  ...props
}: KanbanHeaderProps) => (
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
  onDragStart?: (event: DragStartEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
};

export const KanbanProvider = <
  T extends KanbanItemProps = KanbanItemProps,
  C extends KanbanColumnProps = KanbanColumnProps,
>({
  children,
  onDragStart,
  onDragEnd,
  onDragOver,
  className,
  columns,
  data,
  onDataChange,
  ...props
}: KanbanProviderProps<T, C>) => {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 100,
        delay: 250,
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 100,
        delay: 250,
      }
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const card = data.find((item) => item.id === event.active.id);
    if (card) {
      setActiveCardId(event.active.id as string);
    }
    onDragStart?.(event);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeItem = data.find((item) => item.id === active.id);
    if (!activeItem) return;

    const overId = over.id;
    const overColumn = columns.find((col) => col.id === overId);


    if (overColumn && activeItem.column !== overId) {
      const activeIndex = data.findIndex((item) => item.id === active.id);
      const newData = [...data];
      newData[activeIndex] = { ...newData[activeIndex], column: overId as string };
      onDataChange?.(arrayMove(newData, activeIndex, activeIndex));
    }

    onDragOver?.(event);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCardId(null);
    const { active, over } = event;

    if (!over || active.id === over.id) {
      onDragEnd?.(event);
      return;
    }

    const oldIndex = data.findIndex((item) => item.id === active.id);
    const newIndex = data.findIndex((item) => item.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newData = arrayMove(data, oldIndex, newIndex);
      onDataChange?.(newData);
    }
    
    onDragEnd?.(event);
  };

  const announcements: Announcements = {
    onDragStart({ active }) {
      const card = data.find((item) => item.id === active.id);
      return `Pegou o card "${card?.name}" da coluna "${card?.column}"`;
    },
    onDragOver({ active, over }) {
      const cardName = data.find((item) => item.id === active.id)?.name;
      const newColumnName = columns.find((col) => col.id === over?.id)?.name;
      return `Arrastou o card "${cardName}" sobre a coluna "${newColumnName}"`;
    },
    onDragEnd({ active, over }) {
      const cardName = data.find((item) => item.id === active.id)?.name;
      const newColumnName = data.find(item => item.id === over?.id)?.column || columns.find((col) => col.id === over?.id)?.name;
      return `Soltou o card "${cardName}" na coluna "${newColumnName}"`;
    },
    onDragCancel({ active }) {
      const cardName = data.find((item) => item.id === active.id)?.name;
      return `Cancelou o arrasto do card "${cardName}"`;
    },
  };

  return (
    <KanbanContext.Provider value={{ columns, data, activeCardId }}>
      <DndContext
        accessibility={{ announcements }}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        sensors={sensors}
        {...props}
      >
        <div
          className={cn(
            'grid grid-flow-col auto-cols-[280px] items-start gap-4 overflow-x-auto scrollbar-hidden',
            className
          )}
        >
          {columns.map((column) => children(column))}
        </div>

        {typeof window !== 'undefined' &&
          createPortal(
            <DragOverlay>
              <t.Out />
            </DragOverlay>,
            document.body
          )}
      </DndContext>
    </KanbanContext.Provider>
  );
};