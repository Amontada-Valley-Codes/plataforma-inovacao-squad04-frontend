import type { Metadata } from "next";
import React from "react";
import { getUserRole, getUserCompanyId, getCurrentUser } from "@/lib/auth";
import CompanyHistory from "@/components/history/CompanyHistory";

type HistoryPageProps = {
    params: Promise<{ companyId: string }>;
};

export async function generateMetadata({ params }: HistoryPageProps): Promise<Metadata> {
    const { companyId } = await params;
    return {
        title: `Empresa ${companyId} • Histórico (Ativos)`,
        description: `Desafios ativos da Empresa ${companyId}`,
    };
    }

export default async function HistoryPage({ params }: HistoryPageProps) {
    const { companyId } = await params;

    const role = await getUserRole();
    const viewerCompanyId = await getUserCompanyId();
    const viewer = await getCurrentUser();
    const viewerUserId = viewer?.id as number | undefined;

    return (
        <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
            Empresa / <span className="font-medium">{companyId}</span> /{" "}
            <span className="font-semibold">Histórico</span>
        </div>

        <CompanyHistory
            companyId={Number(companyId)}
            role={role}
            viewerCompanyId={viewerCompanyId}
            viewerUserId={viewerUserId}
        />
        </div>
    );
}
