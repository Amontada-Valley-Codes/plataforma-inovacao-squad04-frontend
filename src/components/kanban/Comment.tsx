import { FilteredCommentReponse } from "@/api/payloads/commentsFunel.payload";
import { commentsService } from "@/api/services/commentsFunnel.service";
import { useState } from "react";
import { toTitleCase } from "./CardsContents";
import { shortDateFormatter } from "./Kanban";
import { Heart, Trash2 } from "lucide-react";

type CommentProps = {
  commentData: FilteredCommentReponse;
  onCommentDeleted: () => void;
};

export const Comment = ({ commentData, onCommentDeleted }: CommentProps) => {
  const [likeCount, setLikeCount] = useState(commentData._count.Comments_funnel_Like);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    setIsLiking(true);
    try {
      const response = await commentsService.likedComment(commentData.id);
      setLikeCount(prev => (response.curtida ? prev + 1 : prev - 1));
    } catch (err) {
      console.error("Erro ao curtir:", err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    try {
      await commentsService.deleteComment(commentData.id);
      onCommentDeleted();
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Não foi possível excluir o comentário.");
    }
  };

  return (
    <div className="flex items-start gap-3 py-3">
      {commentData.users.image ? (
        <img 
          src={commentData.users.image} 
          alt={commentData.users.name} 
          className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-300" 
        />
      ) : (
        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
          {commentData.users.name.charAt(0).toUpperCase()}
        </div>
      )}
      
      {/* comentario */}
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-base text-[#0B2B72]">{toTitleCase(commentData.users.name)}</span>
          <span className="text-xs text-gray-500">{shortDateFormatter.format(new Date(commentData.timestap))}</span>
        </div>

        <p className="text-sm text-gray-600 mt-1">{commentData.comment}</p>

        <div className="flex items-center gap-4 mt-2">
          <button 
            onClick={handleLike} 
            disabled={isLiking}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-red -600 disabled:opacity-50"
          >
            <Heart size={16} />
            {likeCount}
          </button>

          <button 
            onClick={handleDelete}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
