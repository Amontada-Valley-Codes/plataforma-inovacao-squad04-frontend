'use client'; 

import { useState } from 'react';
import { SectionType } from './commentsData';
import { Comment } from './Comment';
import { ChevronDown } from 'lucide-react';

type CollapsibleSectionProps = {
  section: SectionType;
  defaultOpen?: boolean;
};

export const CollapsibleSection = ({ section, defaultOpen = false }: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      {/* header clicavel para abrir/fechar a seçao */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-2 py-4 text-left transition-colors hover:bg-gray-50/50"
      >
        <ChevronDown
          size={20}
          className={`text-gray-600 transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
        />
        <div>
          <h3 className="font-semibold text-black text-base">{section.title}</h3>
          <span className="text-sm text-gray-600">Comentar</span>
        </div>
      </button>

      {/* conteudo que aparece quando a seçao esta aberta */}
      {isOpen && (
        <div className="pl-7 pb-4">
          {section.comments.length > 0 ? (
            section.comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))
          ) : (
            <p className="text-sm text-gray-500 italic py-2">
              Nenhum comentário nesta seção ainda.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

