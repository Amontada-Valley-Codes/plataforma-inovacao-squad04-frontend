"use client";

import React from "react";
import ChallengeCard from "@/components/challenge/ChallengeCard";
import { getCurrentUser } from "@/lib/auth";

export default function MeusDesafiosPage() {
    const [authorName, setAuthorName] = React.useState<string>("");
    const [companyId, setCompanyId] = React.useState<number | undefined>(undefined);

    React.useEffect(() => {
        (async () => {
        const me = await getCurrentUser();
        setAuthorName(me.name);
        // suporta companyId OU empresaId no mock
        const cid = (me as any).companyId ?? (me as any).empresaId;
        setCompanyId(typeof cid === "number" ? cid : undefined);
        })();
    }, []);

    // opcional: placeholder enquanto carrega
    if (!authorName) {
        return <div className="p-4 text-sm text-gray-500">Carregando seus desafios…</div>;
    }

    return (
        <div className="p-2">
        <ChallengeCard onlyMine authorName={authorName} companyId={companyId} />
        </div>
    );
}
