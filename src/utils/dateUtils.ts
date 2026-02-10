import { 
  addDays, 
  addMonths, 
  differenceInDays, 
  startOfMonth, 
  endOfMonth, 
  endOfWeek, 
  format, 
  eachDayOfInterval, 
  eachMonthOfInterval 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Desafio, DesafioWithRow, Granularity, Quarter, TimeUnit } from '@/types/roadmap';

export const generateQuarters = (startDate: Date, numberOfQuarters: number): Quarter[] => {
  const quarters: Quarter[] = [];
  let currentDate = startDate;

  for (let i = 0; i < numberOfQuarters; i++) {
    const quarterStart = currentDate;
    const quarterEnd = addMonths(currentDate, 3);
    quarters.push({
      label: `Q${(i % 4) + 1} ${format(quarterStart, 'yyyy')}`,
      startDate: quarterStart,
      endDate: addDays(quarterEnd, -1),
    });
    currentDate = quarterEnd;
  }

  return quarters;
};

export const generateTimeUnits = (
  startDate: Date,
  endDate: Date,
  granularity: Granularity
): TimeUnit[] => {
  switch (granularity) {
    case 'days':
      return eachDayOfInterval({ start: startDate, end: endDate }).map((date) => ({
        label: format(date, 'd/M', { locale: ptBR }),
        startDate: date,
        endDate: date,
      }));
    case 'weeks':
      const weeks: TimeUnit[] = [];
      let currentWeekStart = startDate;
      
      while (currentWeekStart <= endDate) {
        const weekEnd = endOfWeek(currentWeekStart, { locale: ptBR });
        const actualWeekEnd = weekEnd > endDate ? endDate : weekEnd;
        
        weeks.push({
          label: format(currentWeekStart, 'd/M', { locale: ptBR }) + ' - ' + format(actualWeekEnd, 'd/M', { locale: ptBR }),
          startDate: currentWeekStart,
          endDate: actualWeekEnd,
        });
        
        currentWeekStart = addDays(actualWeekEnd, 1);
      }
      
      return weeks;
    case 'months':
      return eachMonthOfInterval({ start: startDate, end: endDate }).map((date) => ({
        label: format(date, 'MMM', { locale: ptBR }),
        startDate: startOfMonth(date),
        endDate: endOfMonth(date),
      }));
  }
};

export const getUnitWidth = (granularity: Granularity): number => {
  switch (granularity) {
    case 'days':
      return 40;
    case 'weeks':
      return 80;
    case 'months':
      return 120;
  }
};

export const calculateTaskPosition = (
  taskStart: Date,
  taskEnd: Date,
  timelineStart: Date,
  totalDays: number
) => {
  const startOffset = differenceInDays(taskStart, timelineStart);
  const duration = differenceInDays(taskEnd, taskStart) + 1;

  const left = (startOffset / totalDays) * 100;
  const width = (duration / totalDays) * 100;

  return { left: Math.max(0, left), width: Math.max(0, width) };
};

export const calculateTaskPositionByUnits = (
  taskStart: Date,
  taskEnd: Date,
  timeUnits: TimeUnit[],
  unitWidth: number
) => {
  let startUnitIndex = -1;
  let endUnitIndex = -1;

  // Encontra a unidade de início
  for (let i = 0; i < timeUnits.length; i++) {
    const unit = timeUnits[i];
    if (taskStart >= unit.startDate && taskStart <= unit.endDate) {
      startUnitIndex = i;
      break;
    }
    if (taskStart < unit.startDate) {
      startUnitIndex = i;
      break;
    }
  }

  // Encontra a unidade de fim
  for (let i = timeUnits.length - 1; i >= 0; i--) {
    const unit = timeUnits[i];
    if (taskEnd >= unit.startDate && taskEnd <= unit.endDate) {
      endUnitIndex = i;
      break;
    }
    if (taskEnd > unit.endDate) {
      endUnitIndex = i;
      break;
    }
  }

  if (startUnitIndex === -1) startUnitIndex = 0;
  if (endUnitIndex === -1) endUnitIndex = timeUnits.length - 1;

  const left = startUnitIndex * unitWidth;
  const width = (endUnitIndex - startUnitIndex + 1) * unitWidth;

  return { left, width };
};

export const isTaskVisible = (
  taskStart: Date,
  taskEnd: Date,
  timelineStart: Date,
  timelineEnd: Date
): boolean => {
  return taskStart <= timelineEnd && taskEnd >= timelineStart;
};

export const calculateStackedRows = (
  desafios: Desafio[],
  categoryColor: string
): DesafioWithRow[] => {
  const sorted = [...desafios].sort((a, b) => a.data_inicio.getTime() - b.data_inicio.getTime());
  const rows: DesafioWithRow[] = [];
  const rowEndDates: Date[] = [];

  sorted.forEach((desafio) => {
    let assignedRow = 0;
    
    for (let i = 0; i < rowEndDates.length; i++) {
      if (desafio.data_inicio > rowEndDates[i]) {
        assignedRow = i;
        rowEndDates[i] = desafio.data_fim;
        break;
      }
    }

    if (assignedRow === 0 && rowEndDates.length > 0 && desafio.data_inicio <= rowEndDates[0]) {
      assignedRow = rowEndDates.length;
      rowEndDates.push(desafio.data_fim);
    } else if (rowEndDates.length === 0) {
      rowEndDates.push(desafio.data_fim);
    }

    rows.push({ ...desafio, row: assignedRow });
  });

  return rows;
};

export const getMaxRows = (desafios: DesafioWithRow[]): number => {
  if (desafios.length === 0) return 1;
  return Math.max(...desafios.map((d) => d.row)) + 1;
};
