import type { Metadata } from "next";
import React from "react";
import { getUserRole, getUserCompanyId, getCurrentUser } from "@/lib/auth";
import CompanyHistory from "@/components/history/CompanyHistory";

/**
 * Histórico do usuário comum
 * Mostra apenas desafios públicos da empresa do usuário logado.
 * Filtra automaticamente pelo viewerCompanyId e role="usuario".
 */

    export const metadata: Metadata = {
    title: "Meu Histórico • Usuário",
    description: "Histórico de desafios ativos e concluídos do usuário logado",
    };

    export default async function UserHistoryPage() {
    const role = await getUserRole(); // deve retornar "usuario"
    const viewerCompanyId = await getUserCompanyId();
    const viewer = await getCurrentUser();
    const viewerUserId = viewer?.id as number | undefined;

    return (
        <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
            Utilizador / <span className="font-semibold">Histórico</span>
        </div>

        <CompanyHistory
            role={role}
            viewerCompanyId={viewerCompanyId}
            viewerUserId={viewerUserId}
        />
        </div>
    );
    }
