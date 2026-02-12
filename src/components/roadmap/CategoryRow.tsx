import { useMemo } from 'react';
import { Category, Granularity, TimeUnit } from '@/types/roadmap';
import { TaskBar } from './TaskBar';
import { 
  calculateTaskPositionByUnits, 
  isTaskVisible, 
  calculateStackedRows,
  getMaxRows,
  getUnitWidth
} from '@/utils/dateUtils';

interface CategoryRowProps {
  category: Category;
  timelineStart: Date;
  timelineEnd: Date;
  timeUnits: TimeUnit[];
  granularity: Granularity;
  onChallengeClick?: (challengeId: string, challengeName: string, endDate: Date) => void;
}

const BAR_HEIGHT = 40;
const BAR_GAP = 4;
const ROW_PADDING = 8;

export const CategoryRow = ({
  category,
  timelineStart,
  timelineEnd,
  timeUnits,
  granularity,
  onChallengeClick,
}: CategoryRowProps) => {
  const unitWidth = getUnitWidth(granularity);

  const stackedDesafios = useMemo(() => {
    const visibleDesafios = category.desafio.filter((d) =>
      isTaskVisible(d.data_inicio, d.data_fim, timelineStart, timelineEnd)
    );
    return calculateStackedRows(visibleDesafios, category.cor_categoria);
  }, [category.desafio, category.cor_categoria, timelineStart, timelineEnd]);

  const maxRows = getMaxRows(stackedDesafios);
  const rowHeight = maxRows * BAR_HEIGHT + (maxRows - 1) * BAR_GAP + ROW_PADDING * 2;

  return (
    <div className="flex border-b border-border dark:border-gray-700 hover:bg-muted/30 dark:hover:bg-gray-800/30 transition-colors">
      <div 
        className="w-52 flex-shrink-0 border-r border-border dark:border-gray-700 bg-card dark:bg-gray-900 flex items-center gap-3 px-4"
        style={{ minHeight: `${rowHeight}px` }}
      >
        <div
          className="w-1 h-8 rounded-full flex-shrink-0"
          style={{ backgroundColor: category.cor_categoria }}
        />
        <span className="text-sm font-medium text-foreground dark:text-white truncate">
          {category.categoria}
        </span>
      </div>

      <div
        className="flex-1 relative"
        style={{ 
          minWidth: `${timeUnits.length * unitWidth}px`, 
          height: `${rowHeight}px` 
        }}
      >
        <div className="absolute inset-0 flex">
          {timeUnits.map((unit, index) => (
            <div
              key={`grid-${index}`}
              className="border-r border-border/30 dark:border-gray-700/30"
              style={{ width: `${unitWidth}px`, minWidth: `${unitWidth}px` }}
            />
          ))}
        </div>

        {stackedDesafios.map((desafio) => {
          const { left, width } = calculateTaskPositionByUnits(
            desafio.data_inicio,
            desafio.data_fim,
            timeUnits,
            unitWidth
          );

          const top = ROW_PADDING + desafio.row * (BAR_HEIGHT + BAR_GAP);

          return (
            <TaskBar
              key={desafio.id}
              desafio={desafio}
              style={{
                left: `${left}px`,
                width: `${width}px`,
                top: `${top}px`,
                height: `${BAR_HEIGHT}px`,
              }}
              onChallengeClick={onChallengeClick}
            />
          );
        })}
      </div>
    </div>
  );
};
