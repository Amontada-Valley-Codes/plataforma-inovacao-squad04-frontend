export type SectionType = {
  id: string
  title: string
}

export const challangeCommentSections: SectionType[] = [
  { id: 'AI', title: 'Alinhamento Estratégico' },
  { id: 'PI', title: 'Potencial Inovador' },
  { id: 'RN', title: 'Relevância para o Negócio' },
]

export const preScreeningCommentSections: SectionType[] = [
  { id: 'P_AI', title: 'Alinhamento Estratégico' },
  { id: 'P_PI', title: 'Potencial Inovador' },
  { id: 'P_RN', title: 'Relevância para o Negócio' },
]

export const detailedScreeningCommentSections: SectionType[] = [
  { id: 'VT', title: 'Viabilidade Técnica' },
  { id: 'IF', title: 'Impacto Financeiro' },
  { id: 'AE', title: 'Aderência Estratégica' },
  { id: 'R', title: 'Riscos' },
]

export const ideationCommentSections: SectionType[] = [
  { id: 'TAG', title: 'Tags' },
  { id: 'SUGGESTION', title: 'Sugestões' },
  { id: 'CK', title: 'Checklist' },
]

export const experimentationCommentSections: SectionType[] = [
  { id: 'OBJECTIVE', title: 'Objetivo' },
  { id: 'ER', title: 'Escopo Resumido' },
  { id: 'KPIS', title: 'KPIs de Sucesso' },
]
