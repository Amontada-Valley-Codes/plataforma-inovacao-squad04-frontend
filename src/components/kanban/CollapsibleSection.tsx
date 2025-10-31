'use client'; 

import { useState, useEffect } from 'react';
import { SectionType } from './commentsData';
import { Comment } from './Comment';
import { ChevronDown, Loader2 } from 'lucide-react';
import { FilteredCommentReponse, CreateCommentPayload } from '@/api/payloads/commentsFunel.payload';
import { commentsService } from '@/api/services/commentsFunnel.service';
import { showCustomToast } from './KanbanToaster';
import { Toaster } from 'react-hot-toast';


type CollapsibleSectionProps = {
  section: SectionType;
  challengeId: string;
  defaultOpen?: boolean;
};

export const CollapsibleSection = ({ section, challengeId, defaultOpen = false }: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [comments, setComments] = useState<FilteredCommentReponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newCommentText, setNewCommentText] = useState('')

  const fetchComments = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await commentsService.filteredComment(challengeId, section.id)
      setComments(response)
    } catch (err) {
      console.error('Erro ao buscar comentários:', err)
      setError('Não foi possível carregar os comentários.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchComments()
    }
  }, [isOpen, challengeId, section.id])

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCommentText.trim()) return

    const payload: CreateCommentPayload = {
      comment: newCommentText,
      context: section.id,
    }

    try {
      await commentsService.createComment(challengeId, payload)
      setNewCommentText('')
      fetchComments()
    } catch (err) {
      console.error('Erro ao criar comentário:', err)
      showCustomToast('Erro ao enviar comentário.', "error")
    }
  }

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <Toaster position="top-right" reverseOrder={false} />

      {/* header clicavel para abrir/fechar a seçao */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-2 py-4 text-left transition-colors dark:hover:bg-gray-800 hover:bg-gray-50/50"
      >
        <ChevronDown
          size={20}
          className={`text-gray-600 transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
        />
        <div>
          <h3 className="font-semibold text-black dark:text-white text-base">{section.title}</h3>
          <span className="text-sm text-gray-600 dark:text-white">Comentar</span>
        </div>
      </button>

      {/* conteudo que aparece quando a seçao esta aberta */}
      {isOpen && (
        <div className="pl-7 pb-4">
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 size={20} className="animate-spin text-gray-500" />
            </div>
          )}

          {error && <p className="text-sm text-red-500 py-2">{error}</p>}

          {!isLoading && !error && comments.length > 0
            ? comments.map((comment) => (
                <Comment
                  key={comment.id}
                  commentData={comment}
                  onCommentDeleted={fetchComments}
                />
              ))
            : null
          }

          {!isLoading && !error && comments.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-white italic py-2">
              Nenhum comentário nesta seção ainda.
            </p>
          )}

          <form onSubmit={handleCreateComment} className="w-full flex gap-3 pt-4">
            <div className='flex flex-col w-full gap-2'>
              <input
                type="text"
                placeholder="Escreva um comentário..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="w-full rounded-[8px] border border-gray-300 bg-white dark:bg-gray-800 px-4 py-1.5 text-sm focus:outline-none focus:ring focus:ring-[#0B2B72]"
              />
              <button
                type="submit"
                className="text-sm w-fit self-end text-white font-semibold px-2 py-1 rounded-[8px] bg-[#0B2B70] hover:bg-[#09245e] transition-colors"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

