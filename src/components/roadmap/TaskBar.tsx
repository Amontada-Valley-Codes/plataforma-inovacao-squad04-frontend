import { DesafioWithRow } from '@/types/roadmap';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskBarProps {
  desafio: DesafioWithRow;
  style: React.CSSProperties;
  onChallengeClick?: (challengeId: string, challengeName: string, endDate: Date) => void;
}

export const TaskBar = ({ desafio, style, onChallengeClick }: TaskBarProps) => {
  const handleClick = () => {
    if (onChallengeClick) {
      onChallengeClick(desafio.id, desafio.titulo, desafio.data_fim);
    }
  };

  return (
    <div
      className="absolute rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer group overflow-hidden shadow-sm"
      style={{
        ...style,
        backgroundColor: desafio.cor_barra,
      }}
      onClick={handleClick}
    >
      <div className="h-full px-3 py-1.5 flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold truncate text-white">
            {desafio.titulo}
          </span>
          {desafio.links && desafio.links.length > 0 && (
            <div className="hidden group-hover:flex items-center gap-1">
              {desafio.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className="text-white/80 hover:text-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          )}
        </div>
        {desafio.descricao && (
          <span className="text-[10px] truncate text-white/80">
            {desafio.descricao}
          </span>
        )}
      </div>

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
    </div>
  );
};
