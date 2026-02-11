'use client';

import { useState } from 'react';
import { X, ExternalLink, Calendar as CalendarIcon } from 'lucide-react';
import { ChallengeService } from '@/api/services/challenge.service';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { useRouter } from 'next/navigation';

interface UpdateEndDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  challengeId: string;
  challengeName: string;
  currentEndDate: string;
  onSuccess: () => void;
}

export const UpdateEndDateModal = ({
  isOpen,
  onClose,
  challengeId,
  challengeName,
  currentEndDate,
  onSuccess,
}: UpdateEndDateModalProps) => {
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(currentEndDate));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!isOpen) return null;

  const handleViewKanban = () => {
    router.push(`/admin/kanban?challengeId=${challengeId}`);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!endDate) return;
    
    setLoading(true);
    setError(null);

    try {
      const isoDate = endDate.toISOString();
      await ChallengeService.updateEndDate(challengeId, { endDate: isoDate });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar data final');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg mx-2 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-white/90">
              Gerenciar Desafio
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Visualize ou atualize informações do desafio
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-3 space-y-6">
          <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/30 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <Label className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
              Desafio Selecionado
            </Label>
            <p className="text-base font-semibold text-gray-900 dark:text-white mt-2">{challengeName}</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={handleViewKanban}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-500 transition-colors">
                  <ExternalLink className="w-5 h-5 text-blue-600/80 dark:text-blue-400 group-hover:text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-600 dark:text-white">Visualizar no Kanban</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Abrir visão detalhada do desafio</p>
                </div>
              </div>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">ou</span>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-green-100/50 dark:bg-green-900/30 rounded-lg">
                  <CalendarIcon className="w-5 h-5 text-green-600/80 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-600 dark:text-white">Atualizar Data Final</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Para obter um melhor alinhamento de métricas, atualize aqui a data de conclusão
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="endDate" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Nova Data Final
                  </Label>
                  <DatePicker
                    date={endDate}
                    onDateChange={setEndDate}
                    placeholder="Selecione a data final"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="outline"
                    disabled={loading}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !endDate}
                    className="flex-1"
                  >
                    {loading ? 'Salvando...' : 'Salvar Data'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
