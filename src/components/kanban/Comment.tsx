import { CommentType } from './commentsData';
import { Heart } from 'lucide-react';

type CommentProps = {
  comment: CommentType;
};

export const Comment = ({ comment }: CommentProps) => {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-300"></div>
      
      {/* comentario */}
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-base text-[#0B2B72]">{comment.author}</span>
          <span className="text-xs text-gray-500">{comment.timestamp}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{comment.text}</p>
      </div>
    </div>
  );
};
