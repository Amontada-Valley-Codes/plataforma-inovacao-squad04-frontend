// Tipos para garantir a consistência dos dados em todo o projeto.
export type CommentType = {
  id: number;
  author: string;
  timestamp: string;
  text: string;
};

export type SectionType = {
  id: string;
  title: string;
  comments: CommentType[];
};

// --- PACOTES DE DADOS PARA CADA COLUNA DO KANBAN ---

// Pacote de seções de comentários para a coluna "Desafios"
// --- PACOTES DE DADOS PARA CADA COLUNA DO KANBAN ---

// Pacote de seções de comentários para a coluna "Desafios"
export const challangeCommentSections: SectionType[] = [
  { 
    id: 'alinhamento', 
    title: 'Alinhamento Estratégico', 
    comments: [
      {id: 1, author: "Ana Clara", timestamp: "há 1 dia", text: "Verificar o alinhamento desta proposta com as metas de Q4 da empresa."},
      {id: 2, author: "Marcos Vilela", timestamp: "há 2 dias", text: "Precisamos de mais dados para avaliar o alinhamento estratégico."}
    ] 
  },
  { 
    id: 'potencial', 
    title: 'Potencial Inovador', 
    comments: [
      {id: 1, author: "Juliana Mendes", timestamp: "há 3 horas", text: "A ideia tem um diferencial interessante em relação à concorrência."},
      {id: 2, author: "Rafael Nogueira", timestamp: "há 1 dia", text: "Seria bom explorar se há tecnologia proprietária envolvida."}
    ] 
  },
  { 
    id: 'relevancia', 
    title: 'Relevância para o Negócio', 
    comments: [
      {id: 1, author: "Fernanda Lima", timestamp: "há 2 dias", text: "O problema que essa solução resolve parece ter alta demanda no mercado."},
      {id: 2, author: "Thiago Moreira", timestamp: "há 3 dias", text: "Precisamos estimar o impacto potencial em receita ou retenção de clientes."}
    ] 
  },
];

// Pacote de seções de comentários para a coluna "Pré-Triagem"
export const preScreeningCommentSections: SectionType[] = [
  { 
    id: 'alinhamento', 
    title: 'Alinhamento Estratégico', 
    comments: [
      {id: 1, author: "Ana Clara", timestamp: "há 1 dia", text: "Verificar o alinhamento desta proposta com as metas de Q4 da empresa."},
      {id: 2, author: "Marcos Vilela", timestamp: "há 2 dias", text: "Precisamos de mais dados para avaliar o alinhamento estratégico."}
    ] 
  },
  { 
    id: 'potencial', 
    title: 'Potencial Inovador', 
    comments: [
      {id: 1, author: "Lucas Almeida", timestamp: "há 4 horas", text: "Proposta traz um uso criativo de IA, vale aprofundar o estudo."},
      {id: 2, author: "Juliana Mendes", timestamp: "há 1 dia", text: "Verificar se já existe algo semelhante em nosso portfólio interno."}
    ] 
  },
  { 
    id: 'relevancia', 
    title: 'Relevância para o Negócio', 
    comments: [
      {id: 1, author: "Pedro Martins", timestamp: "há 2 dias", text: "Parece resolver um gargalo importante na operação atual."},
      {id: 2, author: "Fernanda Lima", timestamp: "há 3 dias", text: "Confirmar se há sinergia com a nova vertical de serviços."}
    ] 
  },
];

// Pacote de seções para "Triagem Detalhada"
export const detailedScreeningCommentSections: SectionType[] = [
  { 
    id: 'viabilidade', 
    title: 'Viabilidade Técnica', 
    comments: [
      {id: 1, author: "Rafael Nogueira", timestamp: "há 1 hora", text: "Precisamos validar se o protótipo atual é escalável."},
      {id: 2, author: "Marcos Vilela", timestamp: "há 1 dia", text: "Verificar dependências técnicas externas que possam limitar o desenvolvimento."}
    ]
  },
  { 
    id: 'impacto_financeiro', 
    title: 'Impacto Financeiro', 
    comments: [
      {id: 1, author: "Fernanda Lima", timestamp: "há 2 dias", text: "O ROI estimado está dentro do esperado para o porte do projeto."},
      {id: 2, author: "Thiago Moreira", timestamp: "há 3 dias", text: "Incluir custos de manutenção anual na análise de viabilidade financeira."}
    ]
  },
  { 
    id: 'aderencia', 
    title: 'Aderência Estratégica', 
    comments: [
      {id: 1, author: "Ana Clara", timestamp: "há 5 horas", text: "Excelente sinergia com a meta de digitalização da área de operações."},
      {id: 2, author: "Lucas Almeida", timestamp: "há 1 dia", text: "Verificar se há compatibilidade com as iniciativas do programa de inovação aberta."}
    ]
  },
  { 
    id: 'riscos', 
    title: 'Riscos', 
    comments: [
      {id: 1, author: "Juliana Mendes", timestamp: "há 2 horas", text: "Risco médio de dependência de fornecedor externo para a tecnologia principal."},
      {id: 2, author: "Pedro Martins", timestamp: "há 1 dia", text: "Necessário mapeamento de riscos regulatórios antes da fase piloto."}
    ]
  },
];

// Pacote de seções para "Ideação"
export const ideationCommentSections: SectionType[] = [
  { 
    id: 'tags', 
    title: 'Tags', 
    comments: [
      {id: 1, author: "Lucas Almeida", timestamp: "há 3 horas", text: "Sugestão de tags: sustentabilidade, automação, eficiência energética."},
      {id: 2, author: "Ana Clara", timestamp: "há 1 dia", text: "Adicionar tag de impacto social, pois há um benefício indireto à comunidade."}
    ]
  },
  { 
    id: 'sugestoes', 
    title: 'Sugestões', 
    comments: [
      {id: 1, author: "Rafael Nogueira", timestamp: "há 2 horas", text: "Incluir uma etapa de teste rápido antes da validação completa."},
      {id: 2, author: "Juliana Mendes", timestamp: "há 1 dia", text: "Avaliar possibilidade de parcerias com startups que já atuam nesse nicho."}
    ]
  },
  { 
    id: 'checklist', 
    title: 'Checklist', 
    comments: [
      {id: 1, author: "Fernanda Lima", timestamp: "há 5 horas", text: "Falta definir responsáveis pela execução das etapas iniciais."},
      {id: 2, author: "Thiago Moreira", timestamp: "há 1 dia", text: "Checklist quase completo, incluir aprovação da área financeira."}
    ]
  },
];

// Pacote de seções para "Experimentação"
export const experimentationCommentSections: SectionType[] = [
  { 
    id: 'objetivo', 
    title: 'Objetivo', 
    comments: [
      {id: 1, author: "Pedro Martins", timestamp: "há 3 horas", text: "Objetivo claro e mensurável, boa definição de resultado esperado."},
      {id: 2, author: "Ana Clara", timestamp: "há 1 dia", text: "Talvez seja interessante dividir o objetivo em fases menores."}
    ]
  },
  { 
    id: 'escopo', 
    title: 'Escopo Resumido', 
    comments: [
      {id: 1, author: "Juliana Mendes", timestamp: "há 4 horas", text: "Escopo bem definido, mas o cronograma parece apertado."},
      {id: 2, author: "Lucas Almeida", timestamp: "há 2 dias", text: "Precisamos validar se o escopo inclui métricas de aprendizado, não só de resultado."}
    ]
  },
  { 
    id: 'kpi', 
    title: 'KPIs de Sucesso', 
    comments: [
      {id: 1, author: "Rafael Nogueira", timestamp: "há 3 horas", text: "Os KPIs estão bem alinhados com o objetivo geral do experimento."},
      {id: 2, author: "Fernanda Lima", timestamp: "há 1 dia", text: "Adicionar KPI de satisfação do usuário final para enriquecer a análise."}
    ]
  },
];
