'use client';
import { SectionType } from './commentsData';
import { CollapsibleSection } from './CollapsibleSection';
import { SlidersHorizontal } from 'lucide-react';

type CommentsPanelProps = {
  sections: SectionType[];
  challengeId: string;
};

export const CommentsPanel = ({ sections, challengeId }: CommentsPanelProps) => {

  if (!sections || sections.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-center text-gray-500 bg-gray-100">
        Nenhuma seção de comentários foi definida para esta fase do processo.
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-[#D9D9D9]">
      <div className="flex-shrink-0 flex items-center justify-between border-b border-gray-300 p-4">
        <h2 className="flex items-center gap-1 text-lg font-bold text-black">
          <SlidersHorizontal/>
          Comentários
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hidden px-4 py-2 min-h-0">
        {sections.map((section, index) => (
          <CollapsibleSection
            key={section.id}
            section={section}
            challengeId={challengeId}
            defaultOpen={index === sections.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
