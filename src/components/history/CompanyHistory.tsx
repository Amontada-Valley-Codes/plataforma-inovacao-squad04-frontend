// src/components/history/CompanyHistory.tsx
"use client";

import React from "react";
import { Tag, Calendar, MoreHorizontal, Eye, EyeOff } from "lucide-react";
import { challengesData } from "@/mocks/ChallengeData";

type Status = "Completed" | "In Progress" | "Pending" | string;
type Visibility = "Public" | "Private" | string;

    type Challenge = {
    id: number;
    ChallengeTitle: string;
    Author: string;
    Category: string;
    Status: Status;
    Date: string;
    Visibility: Visibility;
    companyId?: number;
    startupId?: number;
    };

    type Role = "admin" | "gestor" | "avaliador" | "usuario";

    /** ⚠️ NÃO use 'PageProps' aqui. Use um nome único pra props do componente */
    type CompanyHistoryProps = {
    /** companyId da rota /company/[companyId]/history */
    companyId?: number;

    /** contexto de permissão */
    role: Role;
    viewerCompanyId?: number;
    viewerUserId?: number; // (não usado aqui)

    /** aqui NÃO tem tabs/busca; fechados vão pra outra página */
    };

    export default function CompanyHistory({
    companyId,
    role,
    viewerCompanyId,
    }: CompanyHistoryProps) {
    const data: Challenge[] = challengesData as Challenge[];

    // Mostra só desafios ATIVOS (exclui "Completed"). Arquivados/Concluídos ficam em outra página.
    const activeFilter = (c: Challenge) => c.Status !== "Completed";

    const filtered = React.useMemo(() => {
        let base = data.filter(activeFilter);

        // 1) escopo pela rota (se vier)
        if (typeof companyId === "number") {
        base = base.filter((c) => c.companyId === companyId);
        }

        // 2) escopo por role
        if (role === "admin") return base;

        if (role === "gestor" || role === "avaliador") {
        if (typeof viewerCompanyId !== "number") return [];
        return base.filter((c) => c.companyId === viewerCompanyId);
        }

        // usuario: somente públicos da empresa dele
        if (typeof viewerCompanyId !== "number") return [];
        return base.filter(
        (c) => c.companyId === viewerCompanyId && c.Visibility === "Public"
        );
    }, [data, companyId, role, viewerCompanyId]);

    if (!filtered.length) {
        return (
        <div className="w-full p-6 text-sm text-gray-500">
            Ainda não há desafios ativos para exibir.
        </div>
        );
    }

    const getStatusColor = (status: Status) => {
        switch (status) {
        case "Completed":
            return "bg-emerald-400";
        case "In Progress":
            return "bg-yellow-400";
        case "Pending":
            return "bg-red-400";
        default:
            return "bg-gray-400";
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full p-4">
        {filtered.map((challenge: Challenge) => {
            const isPublic = challenge.Visibility === "Public";

            return (
            <div
                key={challenge.id}
                className="border border-gray-200 dark:border-gray-800 dark:bg-gray-900 bg-white rounded-xl p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform"
            >
                {/* Header */}
                <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-300">
                    {challenge.ChallengeTitle}
                    </h2>
                    <p className="text-gray-500 dark:text-[#ced3db] text-sm">
                    {challenge.Author}
                    </p>
                </div>
                <button aria-label="Mais opções">
                    <MoreHorizontal className="text-gray-400 dark:text-[#ced3db] hover:text-gray-600 cursor-pointer" />
                </button>
                </div>

                {/* Metas */}
                <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-sm">
                    <Tag size={16} /> {challenge.Category}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-sm">
                    <span className={`w-3 h-3 rounded-full ${getStatusColor(challenge.Status)}`} />
                    {challenge.Status}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-sm">
                    <Calendar size={16} /> {challenge.Date}
                </div>
                </div>

                {/* Rodapé */}
                <div className="mt-4 flex items-center justify-between">
                <div className="text-gray-600 dark:text-[#ced3db]">
                    {isPublic ? (
                    <span title="Público" className="inline-flex items-center gap-1 text-sm">
                        <Eye size={18} /> Público
                    </span>
                    ) : (
                    <span title="Privado" className="inline-flex items-center gap-1 text-sm">
                        <EyeOff size={18} /> Privado
                    </span>
                    )}
                </div>
                </div>
            </div>
            );
        })}
        </div>
    );
}
