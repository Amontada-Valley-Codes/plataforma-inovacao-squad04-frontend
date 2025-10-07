'use client';
import { SectionType } from './commentsData';
import { CollapsibleSection } from './CollapsibleSection';
import { SlidersHorizontal } from 'lucide-react';

type CommentsPanelProps = {
  sections: SectionType[];
};

export const CommentsPanel = ({ sections }: CommentsPanelProps) => {
  // se nao houver seçoes para a coluna atual, exibe uma mensagem
  if (!sections || sections.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-center text-gray-500 bg-gray-100">
        Nenhuma seção de comentários foi definida para esta fase do processo.
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-[#D9D9D9]">
      {/* header do painel */}
      <div className="flex-shrink-0 flex items-center justify-between border-b border-gray-300 p-4">
        <h2 className="flex items-center gap-1 text-lg font-bold text-black">
          <SlidersHorizontal/>
          Comentários
        </h2>
      </div>

      {/* lista de seções com scroll */}
      <div className="flex-1 overflow-y-auto scrollbar-hidden px-4 py-2 min-h-0">
        {sections.map((section, index) => (
          <CollapsibleSection
            key={section.id}
            section={section}
            defaultOpen={index === sections.length - 1}
          />
        ))}
      </div>

      {/* input de comentário fixo na parte inferior */}
      <div className="relative flex-shrink-0 flex items-center gap-3 border-t border-gray-300 p-4">
        <input
          type="text"
          placeholder="Escreva um comentário..."
          className="w-full pl-14 rounded-[8px] border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute h-6 w-6 flex-shrink-0 rounded-full left-8 bg-[#d9d9d9]"></div>
      </div>
    </div>
  );
};
