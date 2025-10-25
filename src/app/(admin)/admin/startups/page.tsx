import StartupCard from "@/components/startup/StartupCard";
import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AdminStartupsPage() {
  const role = await getUserRole();
  if (role !== "admin" && role !== "gestor") redirect("/");

  return (
    <div className="p-4">
      <Suspense fallback={<p>Carregando...</p>}>
        <StartupCard role={role} />
      </Suspense>
    </div>
  );
}
