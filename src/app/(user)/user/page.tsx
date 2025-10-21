// src/app/(user)/user/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, getUserRole } from "@/lib/auth";

export default function UserHomePage() {
    const [user, setUser] = useState<{ id: string | null; email: string | null }>({ id: null, email: null });
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        getCurrentUser().then(setUser);
        getUserRole().then(setRole);
    }, []);

    if (!user || !role) return <p className="p-6">A carregar...</p>;

    return (
        <div className="p-6 space-y-3">
            <h1 className="text-2xl font-semibold">Painel do Usuário</h1>
            <p className="text-sm text-gray-500">Bem-vindo à sua conta!</p>

            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Role:</strong> {role}</p>
            </div>
        </div>
    );
}
