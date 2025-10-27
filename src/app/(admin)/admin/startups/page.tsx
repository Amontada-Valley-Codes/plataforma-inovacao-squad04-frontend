'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StartupCard from "@/components/startup/StartupCard";

export type Role = "admin" | "gestor" | "avaliador" | "usuario";

import { getUserRole } from "@/lib/auth";

function isRole(v: any): v is Role {
  return v === "admin" || v === "gestor" || v === "avaliador" || v === "usuario";
}

export default function AdminStartupsPage() {
  const [role, setRole] = useState<Role | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const userRole = await getUserRole(); 
      
      if (!isRole(userRole)) {
        router.replace("/");
        return;
      }

      if (userRole !== "admin" && userRole !== "gestor") {
        router.replace("/");
        return;
      }

      setRole(userRole); 
    })();
  }, [router]);

  if (!role) return <p className="p-4">Carregando...</p>;

  return (
    <div className="p-4">
      <StartupCard role={role} />
    </div>
  );
}
