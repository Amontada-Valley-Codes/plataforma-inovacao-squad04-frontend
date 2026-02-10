import { Quarter, TimeUnit, Granularity } from '@/types/roadmap';
import { getUnitWidth } from '@/utils/dateUtils';

interface RoadmapHeaderProps {
  quarters: Quarter[];
  timeUnits: TimeUnit[];
  granularity: Granularity;
}

export const RoadmapHeader = ({ timeUnits, granularity }: RoadmapHeaderProps) => {
  const unitWidth = getUnitWidth(granularity);

  return (
    <div className="sticky top-0 z-20 bg-card dark:bg-gray-900 border-b border-border dark:border-gray-700">
      <div className="flex">
        <div className="w-52 flex-shrink-0 bg-card dark:bg-gray-900 border-r border-border dark:border-gray-700 px-4 py-2">
          <span className="text-xs font-medium text-muted-foreground dark:text-gray-400 uppercase tracking-wider">
            Etapas
          </span>
        </div>
        <div className="flex flex-1">
          {timeUnits.map((unit, index) => (
            <div
              key={`unit-${index}`}
              className="text-center py-2 border-r border-border/50 dark:border-gray-700/50 last:border-r-0"
              style={{ width: `${unitWidth}px`, minWidth: `${unitWidth}px` }}
            >
              <span className="text-[10px] text-muted-foreground dark:text-gray-400 whitespace-nowrap">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
