'use client'; 

import { useState, useEffect } from 'react';

import { Comment } from './Comment';
import { ChevronDown, Loader2 } from 'lucide-react';
import { FilteredCommentReponse, CreateCommentPayload } from '@/api/payloads/commentsFunel.payload';
import { commentsService } from '@/api/services/commentsFunnel.service';
import { showCustomToast } from './KanbanToaster';
import { Toaster } from 'react-hot-toast';


type CommentFeedProps = {
  context: "GENERATION" | "PRE_SCREENING" | "MATERIALIZATION" | "DETAILED_SCREENING" | "EXPERIMENTATION" | "SCALE" | string;
  challengeId: string;
};

export const CommentFeed = ({ context, challengeId }: CommentFeedProps) => {
  const [comments, setComments] = useState<FilteredCommentReponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newCommentText, setNewCommentText] = useState('')

  const fetchComments = async () => {
    setIsLoading(true)
    setError(null)  
    try {
      const response = await commentsService.filteredComment(challengeId, context)
      setComments(response)
    } catch (err) {
      console.error('Erro ao buscar comentários:', err)
      setError('Não foi possível carregar os comentários.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [challengeId, context])

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCommentText.trim()) return

    const payload: CreateCommentPayload = {
      comment: newCommentText,
      context: context
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
              Nenhum comentário nesta etapa  ainda.
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
    </div>
  );
};

