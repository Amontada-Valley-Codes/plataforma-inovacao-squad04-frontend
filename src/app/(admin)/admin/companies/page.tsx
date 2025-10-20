"use client";
import { useEffect, useState } from "react";
import { getUserRole } from "@/lib/auth";
import CompanieCard from "@/components/companies/CompanieCard";

export default function AdminCompaniesPage() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    getUserRole().then(setRole);
  }, []);

  if (!role) return null; // ou spinner
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

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <CompanieCard role="admin" />
    </div>
  );
}
