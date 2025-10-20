"use client";
import React, { useEffect } from "react";
import { getUserRole, getCurrentUser, getUserCompanyId } from "@/lib/auth";

export default function DebugAuth() {
    useEffect(() => {
        async function load() {
            const role = await getUserRole();
            const user = await getCurrentUser();
            const company = await getUserCompanyId();
            console.log("Role:", role);
            console.log("User:", user);
            console.log("Company ID:", company);
        }
        load();
    }, []);

    return <div className="p-4 text-sm text-gray-600">Verifique o console 🔍</div>;
}
