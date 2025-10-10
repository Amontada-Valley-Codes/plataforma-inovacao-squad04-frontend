// src/mocks/HistoryData.ts
export type HistoryItem = {
    id: string;
    companyId: number;
    createdByUserId: number;
    status: "concluido" | "arquivado";
    title: string;
    description?: string;
    kind: "desafio" | "kanban" | "avaliacao" | "empresa" | "startup";
    updatedAt: string;
    tags?: string[];
    reference?: string;
};

export const historyData: HistoryItem[] = [
    {
        id: "h-1",
        companyId: 1,
        createdByUserId: 101,
        status: "concluido",
        title: "Desafio X finalizado",
        description: "Avaliador marcou como concluído após revisão.",
        kind: "desafio",
        updatedAt: "2025-09-21T11:00:00Z",
        tags: ["prioridade-alta", "IA"],
        reference: "DESAFIO-392",
    },
    {
        id: "h-2",
        companyId: 1,
        createdByUserId: 102,
        status: "arquivado",
        title: "Tarefa 'Integrar API' arquivada",
        description: "Movida para arquivo após entrega.",
        kind: "kanban",
        updatedAt: "2025-09-18T09:30:00Z",
        tags: ["backend"],
        reference: "KB-120",
    },
    {
        id: "h-3",
        companyId: 2,
        createdByUserId: 201,
        status: "concluido",
        title: "Startup Beta avaliação concluída",
        kind: "avaliacao",
        updatedAt: "2025-10-01T15:10:00Z",
        tags: ["beta", "produto"],
    },
    {
        id: "h-4",
        companyId: 1,
        createdByUserId: 103,
        status: "concluido",
        title: "Perfil da Empresa atualizado",
        description: "Alteração de dados fiscais.",
        kind: "empresa",
        updatedAt: "2025-09-29T12:00:00Z",
    },
    {
        id: "h-5",
        companyId: 1,
        createdByUserId: 103,
        status: "arquivado",
        title: "Startup Alpha – proposta arquivada",
        kind: "startup",
        updatedAt: "2025-09-05T08:00:00Z",
        tags: ["proposta"],
    },
];
