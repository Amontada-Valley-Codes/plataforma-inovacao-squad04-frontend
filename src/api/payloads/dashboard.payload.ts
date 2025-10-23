type EmpresaRanking = {
  name: string;
  totalDesafios: number;
};

export type adminDasboardResponse = {
  totalEmpresas: number;
  totalDesafios: number;
  totalIdeias: number;
  empresasAtivas: number;
  desempenhoMensal:  Record<string, number>;
  distribuicaoPorSetor: Record<string, number>;
  participacaoMensal: string[] | [];
  rankingEmpresas: EmpresaRanking[];
}

export type gestorDasboardResponse = {
  totalDesafios: number
  totalPocs: number
  totalIdeas: number
  totalUsers: number
}