/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import ChallengeCard from "@/components/challenge/ChallengeCard";
import { getCurrentUser } from "@/lib/auth";

type AnyObj = Record<string, any>;

function extractUserName(me: unknown): string {
    const m = (me ?? {}) as AnyObj;
    return (
        m.name ??
        m.username ??
        m.fullName ??
        m.user_name ??
        m.displayName ??
        (typeof m.email === "string" ? m.email.split("@")[0] : "") ??
        ""
    );
}
function extractCompanyId(me: unknown): number | undefined {
    const m = (me ?? {}) as AnyObj;
    const cid = m.companyId ?? m.empresaId ?? m.enterpriseId ?? m.orgId;
    return typeof cid === "number" ? cid : undefined;
}

function getAuthorIdFromToken(): string | undefined {
    if (typeof window === "undefined") return undefined;
    const keys = ["access_token", "token", "auth_token"];
    for (const k of keys) {
        const t = localStorage.getItem(k);
        if (t && t !== "undefined" && t !== "null") {
            try {
                const [, payload] = t.split(".");
                if (!payload) break;
                const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
                const p = JSON.parse(json) as AnyObj;
                // tenta várias formas comuns
                return String(p.sub ?? p.userId ?? p.id ?? "");
            } catch { }
        }
    }
    return undefined;
}

export default function MeusDesafiosPage() {
    const [authorId, setAuthorId] = React.useState<string | undefined>(undefined);
    const [authorName, setAuthorName] = React.useState<string>("");
    const [companyId, setCompanyId] = React.useState<number | undefined>(undefined);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        (async () => {
            try {
                const me = await getCurrentUser();
                setAuthorName(extractUserName(me));
                setCompanyId(extractCompanyId(me));
                setAuthorId(getAuthorIdFromToken()); // 👈 ID do token
            } catch (err) {
                console.error("Erro ao carregar usuário:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return <div className="p-4 text-sm text-gray-500">Carregando seus desafios…</div>;
    }

    return (
        <div className="p-2">
            <ChallengeCard
                onlyMine
                authorId={authorId}      
                authorName={authorName}  
                companyId={companyId}
            />
        </div>
    );
}
