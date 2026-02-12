import { Category } from '@/types/roadmap';

interface RoadmapLegendProps {
  categories: Category[];
}

export const RoadmapLegend = ({ categories }: RoadmapLegendProps) => {
  return (
    <div className="flex flex-wrap gap-4 px-4 py-3 bg-muted/20 dark:bg-gray-800/20">
      {categories.map((category) => (
        <div key={category.id} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: category.cor_categoria }}
          />
          <span className="text-sm text-muted-foreground dark:text-gray-400">{category.categoria}</span>
        </div>
      ))}
    </div>
  );
};
