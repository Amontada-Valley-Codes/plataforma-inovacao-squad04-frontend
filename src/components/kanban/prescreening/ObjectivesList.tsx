import { Pencil, Trash2 } from "lucide-react";

type StrategicObjective = {
  id: string;
  name: string;
  description: string;
};

type ObjectivesListProps = {
  objectives: StrategicObjective[];
  selectedObjectives: Set<string>;
  onToggleObjective: (id: string) => void;
  showActions?: boolean;
  onEdit?: (objective: StrategicObjective) => void;
  onDelete?: (objective: StrategicObjective) => void;
};

export const ObjectivesList = ({ objectives, showActions = false, onEdit, onDelete }: ObjectivesListProps) => {
  return (
    <>
      <div className="mb-3">
        <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Objetivos Estratégicos ({objectives.length})
        </h4>
      </div>

      <div className="space-y-2 mb-4">
        {objectives.map((obj) => {
          return (
            <div
              key={obj.id}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#0B2B70] dark:text-white">{obj.name}</p>
                    {showActions && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button 
                          onClick={() => onEdit?.(obj)}
                          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" 
                          title="Editar"
                        >
                          <Pencil size={12} />
                        </button>
                        <button 
                          onClick={() => onDelete?.(obj)}
                          className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" 
                          title="Excluir"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">{obj.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
