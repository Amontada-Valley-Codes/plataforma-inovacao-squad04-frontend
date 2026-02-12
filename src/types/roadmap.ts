export type Granularity = 'days' | 'weeks' | 'months';

export interface Desafio {
  id: string;
  titulo: string;
  descricao?: string;
  data_inicio: Date;
  data_fim: Date;
  cor_barra: string;
  links?: { url: string; label?: string }[];
}

export interface DesafioWithRow extends Desafio {
  row: number;
}

export interface Category {
  id: string;
  categoria: string;
  cor_categoria: string;
  desafio: Desafio[];
}

export interface Quarter {
  label: string;
  startDate: Date;
  endDate: Date;
}

export interface TimeUnit {
  label: string;
  startDate: Date;
  endDate: Date;
}
