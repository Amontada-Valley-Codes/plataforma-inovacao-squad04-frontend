"use client";

import React from "react";
import CompanieCard from "@/components/companies/CompanieCard";
import { getCurrentUser, type Role } from "@/lib/auth";

export default function AdminCompaniesClient() {
    const [role, setRole] = React.useState<Role | null>(null);

    React.useEffect(() => {
        (async () => {
            const me = await getCurrentUser(); // lê do localStorage
            setRole(me?.role ?? "usuario");
        })();
    }, []);

    if (role === null) {
        return (
            <div className="p-6 w-full flex justify-center">
                <div className="w-8 h-8 border-4 border-[#15358D]/30 border-t-[#15358D] rounded-full animate-spin" />
            </div>
        );
    }

    if (role !== "admin") {
        return (
            <main className="p-6">
                <h1 className="text-lg font-semibold">403 • Acesso negado</h1>
                <p className="text-sm text-muted-foreground">
                    Esta área é exclusiva para administradores.
                </p>
            </main>
        );
    }

    return <CompanieCard role="admin" />;
}
