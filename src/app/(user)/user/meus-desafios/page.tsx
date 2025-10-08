// src/app/user/meus-desafios/page.tsx
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
        setCompanyId(me.empresaId);
        })();
    }, []);

    return (
        <div className="p-2">
        <ChallengeCard
            onlyMine
            authorName={authorName}     // pode omitir, que o Card busca do auth; deixei explícito
            companyId={companyId}
        />
        </div>
    );
}
