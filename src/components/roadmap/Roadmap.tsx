import { useMemo, useState } from 'react';
import { Category, Granularity } from '@/types/roadmap';
import { generateQuarters, generateTimeUnits } from '@/utils/dateUtils';
import { RoadmapHeader } from './RoadmapHeader';
import { CategoryRow } from './CategoryRow';
import { GranularitySelector } from './GranularitySelector';
import { RoadmapLegend } from './RoadmapLegend';

interface RoadmapProps {
  data: Category[];
  startDate?: Date;
  numberOfQuarters?: number;
  onChallengeClick?: (challengeId: string, challengeName: string, endDate: Date) => void;
}

export const Roadmap = ({
  data,
  startDate = new Date('2026-01-01'),
  numberOfQuarters = 4,
  onChallengeClick,
}: RoadmapProps) => {
  const [granularity, setGranularity] = useState<Granularity>('weeks');
  const currentYear = new Date().getFullYear();

  const quarters = useMemo(
    () => generateQuarters(startDate, numberOfQuarters),
    [startDate, numberOfQuarters]
  );

  const timelineStart = quarters[0].startDate;
  const timelineEnd = quarters[quarters.length - 1].endDate;

  const timeUnits = useMemo(
    () => generateTimeUnits(timelineStart, timelineEnd, granularity),
    [timelineStart, timelineEnd, granularity]
  );

  return (
    <div className="bg-card dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border dark:border-gray-700 bg-muted/30 dark:bg-gray-800/50">
        <span className="text-xl font-semibold text-gray-600 dark:text-white/90">
          Roadmap de Desafios {currentYear}
        </span>
        <GranularitySelector value={granularity} onChange={setGranularity} />
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <div className="min-w-fit">
          <RoadmapHeader 
            quarters={quarters} 
            timeUnits={timeUnits}
            granularity={granularity}
          />  
          <div>
            {data.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                timelineStart={timelineStart}
                timelineEnd={timelineEnd}
                timeUnits={timeUnits}
                granularity={granularity}
                onChallengeClick={onChallengeClick}
              />
            ))}
          </div>
        </div>
      </div>

      <RoadmapLegend categories={data} />
    </div>
  );
};
