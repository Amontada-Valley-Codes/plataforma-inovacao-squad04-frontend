"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StartupCard from "@/components/startup/StartupCard";

import { getUserRole } from "@/lib/auth";
import type { Role } from "@/lib/roles";

export default function AdminStartupsPage() {
  const [role, setRole] = useState<Role | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userRole = getUserRole();

    if (!userRole) {
      router.replace("/");
      return;
    }

    // Apenas ADMINISTRATOR e MANAGER podem acessar
    if (
      userRole !== "ADMINISTRATOR" &&
      userRole !== "MANAGER"
    ) {
      router.replace("/");
      return;
    }

    setRole(userRole);
  }, [router]);

  if (!role) return <p className="p-4">Carregando...</p>;

  return (
    <div className="p-4">
      <StartupCard role={role} />
    </div>
  );
}