import { Lightbulb, ChevronDown, ChevronUp } from "lucide-react";

type Suggestion = {
  id: string;
  title: string;
  description: string;
};

type SuggestionsListProps = {
  suggestions: Suggestion[];
  showSuggestions: boolean;
  onToggle: () => void;
};

export const SuggestionsList = ({ suggestions, showSuggestions, onToggle }: SuggestionsListProps) => {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
      <button onClick={onToggle} className="flex items-center justify-between w-full mb-2">
        <div className="flex items-center gap-2">
          <Lightbulb size={14} className="text-yellow-500" />
          <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Sugestões Relacionadas ({suggestions.length})
          </h4>
        </div>
        {showSuggestions ? (
          <ChevronUp size={14} className="text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronDown size={14} className="text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {showSuggestions && (
        <div className="space-y-2">
          {suggestions.map((s) => (
            <div
              key={s.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{s.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">{s.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
