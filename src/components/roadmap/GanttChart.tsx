'use client';

import { useEffect, useState } from 'react';
import { Roadmap } from '@/components/roadmap/Roadmap';
import { Category } from '@/types/roadmap';
import { ChallengeService } from '@/api/services/challenge.service';
import { GanttChartItem } from '@/api/payloads/challenge.payload';
import { UpdateEndDateModal } from './UpdateEndDateModal';
import ChallengesByStageChart from '@/components/charts/bar/ChallengesByStageChart';

const COLORS = [
  '#0f2e73', // mais escuro
  '#123684',
  '#15409c', // seu azul base
  '#1c4fb8',
  '#2a61d1',
  '#3f74e0',
  '#5b8bea',
  '#7aa3f2',
  '#9bbcf7',
  '#c2d7fc'  // mais claro
];

const STATUS_LABELS: Record<string, string> = {
  'GENERATION': 'Geração',
  'PRE_SCREENING': 'Pré-Triagem',
  'DETAILED_SCREENING': 'Triagem Detalhada',
  'MATERIALIZATION': 'Materialização',
  'EXPERIMENTATION': 'Experimentação',
  'SCALE': 'Escala'
};

const STATUS_ORDER = ['GENERATION', 'PRE_SCREENING', 'DETAILED_SCREENING', 'MATERIALIZATION', 'EXPERIMENTATION', 'SCALE'];

// Função para converter string de data para Date sem problemas de timezone
const parseDate = (dateString: string): Date => {
  // Extrai apenas a parte da data (YYYY-MM-DD) ignorando o horário e timezone
  const dateOnly = dateString.split('T')[0];
  const [year, month, day] = dateOnly.split('-').map(Number);
  // Cria data no timezone local sem conversão
  return new Date(year, month - 1, day);
};

export default function GanttChart() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<{ id: string; name: string; endDate: string } | null>(null);

  useEffect(() => {
    loadGanttData();
  }, []);

  const loadGanttData = async () => {
    try {
      setLoading(true);
      const data = await ChallengeService.getGanttChart();
     
      const transformedData = transformApiDataToCategories(data);
      setCategories(transformedData);
    } catch (err) {
      console.error('Erro ao carregar dados do Gantt:', err);
      setError('Erro ao carregar dados do gráfico de Gantt');
    } finally {
      setLoading(false);
    }
  };

  const transformApiDataToCategories = (data: GanttChartItem[]): Category[] => {
    const categoryMap = new Map<string, Category>();

    // Inicializa todas as categorias (etapas)
    STATUS_ORDER.forEach((status, index) => {
      categoryMap.set(status, {
        id: status,
        categoria: STATUS_LABELS[status] || status,
        cor_categoria: COLORS[index % COLORS.length],
        desafio: [],
      });
    });

    // Agrupa desafios por status
    data.forEach((item) => {
      const status = item.status || 'GENERATION';
      const category = categoryMap.get(status);
      
      if (category) {
        const dataInicio = item.startDate ? parseDate(item.startDate) : parseDate(item.createdAt);
        
        category.desafio.push({
          id: item.id,
          titulo: item.name,
          descricao: item.problemDescription,
          data_inicio: dataInicio,
          data_fim: parseDate(item.endDate),
          cor_barra: category.cor_categoria,
        });
      }
    });

    return Array.from(categoryMap.values());
  };

  const handleChallengeClick = (challengeId: string, challengeName: string, endDate: Date) => {
    console.log('Challenge clicado - ID:', challengeId, 'Nome:', challengeName);
    setSelectedChallenge({
      id: challengeId,
      name: challengeName,
      endDate: endDate.toISOString(),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground dark:text-gray-400">Carregando </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={loadGanttData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ChallengesByStageChart />
      
      <Roadmap 
        data={categories} 
        startDate={new Date('2026-01-01')}
        numberOfQuarters={4}
        onChallengeClick={handleChallengeClick}
      />

      {selectedChallenge && (
        <UpdateEndDateModal
          isOpen={!!selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          challengeId={selectedChallenge.id}
          challengeName={selectedChallenge.name}
          currentEndDate={selectedChallenge.endDate}
          onSuccess={loadGanttData}
        />
      )}
    </div>
  );
}
