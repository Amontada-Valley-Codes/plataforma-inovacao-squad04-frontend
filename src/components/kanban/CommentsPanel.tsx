'use client';
import { CommentFeed } from './CommentFeed';
import { SlidersHorizontal } from 'lucide-react';
import { getStatusLabel } from './KanbanTable';

type CommentsPanelProps = {
  context: "GENERATION" | "PRE_SCREENING" | "MATERIALIZATION" | "DETAILED_SCREENING" | "EXPERIMENTATION" | "SCALE" | string;
  challengeId: string;
  onChangeView: (view: "historico") => void;
};

export const CommentsPanel = ({ context, challengeId, onChangeView }: CommentsPanelProps) => {
  return (
    <div className="flex h-full w-full flex-col bg-[#d9d9d9] dark:bg-gray-900">
      <div className="flex-shrink-0 flex items-center justify-between border-b border-gray-300 p-4">
        <h2 className="flex items-center gap-1 text-lg font-bold text-black dark:text-white">
          <SlidersHorizontal/>
          Comentários - {getStatusLabel(context)}
        </h2>
        <button 
          className="text-sm w-fit self-end text-white font-semibold px-2 py-1 rounded-[8px] bg-[#0B2B70] hover:bg-[#09245e] transition-colors"
          onClick={() => onChangeView("historico")}
        >
          Ver histórico de atividade
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 min-h-0">
        <CommentFeed
          challengeId={challengeId}
          context={context}
        />
      </div>
    </div>
  );
};
