import { Granularity } from '@/types/roadmap';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Calendar, CalendarDays, CalendarRange } from 'lucide-react';

interface GranularitySelectorProps {
  value: Granularity;
  onChange: (value: Granularity) => void;
}

export const GranularitySelector = ({ value, onChange }: GranularitySelectorProps) => {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(val) => val && onChange(val as Granularity)}
      className="
        inline-flex items-center
        rounded-xl border border-border dark:border-gray-700
        bg-muted/40 dark:bg-gray-800/40 p-1
      "
    >
      <ToggleGroupItem
        value="days"
        aria-label="Visualização por dias"
        className="
          flex items-center gap-2
          px-3 py-1.5
          text-xs font-medium
          text-gray-600 dark:text-gray-300
          rounded-lg
          transition-all
          hover:bg-muted dark:hover:bg-gray-700
          data-[state=on]:bg-primary
          data-[state=on]:text-primary-foreground
          data-[state=on]:shadow-sm
        "
      >
        <Calendar className="h-4 w-4" />
        Dias
      </ToggleGroupItem>

      <ToggleGroupItem
        value="weeks"
        aria-label="Visualização por semanas"
        className="
          flex items-center gap-2
          px-3 py-1.5
          text-xs font-medium
          text-gray-600 dark:text-gray-300
          rounded-lg
          transition-all
          hover:bg-muted dark:hover:bg-gray-700
          data-[state=on]:bg-primary
          data-[state=on]:text-primary-foreground
          data-[state=on]:shadow-sm
        "
      >
        <CalendarDays className="h-4 w-4" />
        Semanas
      </ToggleGroupItem>

      <ToggleGroupItem
        value="months"
        aria-label="Visualização por meses"
        className="
          flex items-center gap-2
          px-3 py-1.5
          text-xs font-medium
          text-gray-600 dark:text-gray-300
          rounded-lg
          transition-all
          hover:bg-muted dark:hover:bg-gray-700
          data-[state=on]:bg-primary
          data-[state=on]:text-primary-foreground
          data-[state=on]:shadow-sm
        "
      >
        <CalendarRange className="h-4 w-4" />
        Meses
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
