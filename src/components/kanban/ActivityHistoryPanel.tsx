'use client';

import { SectionType } from './commentsData';
import { SlidersHorizontal,  UserCircle2 } from 'lucide-react';

type ActivityHistoryPanelProps = {
  sections: SectionType[];
  challengeId: string;
  onChangeView:(view: "comentarios") => void;
};

type ActivityHistory = {
  date: string;
  user: string;
  action: string;
  reason: string;
}

export const ActivityHistoryPanel = ({ sections, challengeId, onChangeView }: ActivityHistoryPanelProps) => {

  const activityHistory: ActivityHistory[] = [
    {
      date: '08/01/2026 14:32',
      user: 'Eduardo Albuquerque',
      action: 'Comentário adicionado',
      reason: 'Feedback sobre a proposta',
    },
    {
      date: '07/01/2026 10:15',
      user: 'Gestor X',
      action: 'Status alterado',
      reason: 'Desafio aprovado para próxima fase',
    },
  ];

  if (!sections || sections.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-center text-gray-500 dark:text-white bg-gray-100 dark:bg-gray-900">
        Nenhuma seção de comentários foi definida para esta fase do processo.
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-[#d9d9d9] dark:bg-gray-900">
      <div className="flex-shrink-0 flex items-center justify-between border-b border-gray-300 p-4">
        <h2 className="flex items-center gap-1 text-lg font-bold text-black dark:text-white">
          <SlidersHorizontal/>
          Histórico de atividade
        </h2>
        <button 
          className="text-sm w-fit self-end text-white font-semibold px-2 py-1 rounded-[8px] bg-[#0B2B70] hover:bg-[#09245e] transition-colors"
          onClick={() => onChangeView("comentarios")}
        >
          Ver comentários
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 min-h-0">
        {activityHistory.map((activity, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-300 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900 transition-colors p-3 mt-2 shadow-sm"
          >
            <div className="flex justify-between text-xs text-black dark:text-gray-400">
              <span className="flex items-center gap-1">
                <UserCircle2 size={14} className="text-gray-500 dark:text-gray-400" />
                {activity.user}
              </span>
              <span>{activity.date}</span>
            </div>

            <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-white">
              {activity.action}
            </p>

            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Motivo: {activity.reason}
            </p>
          </div>
        ))}

        {activityHistory.length === 0 && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Nenhuma atividade registrada até o momento.
          </p>
        )} 
      </div>
    </div>
  );
};
