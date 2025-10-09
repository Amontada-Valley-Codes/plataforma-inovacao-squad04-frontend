// src/app/(admin)/admin/startups/page.tsx
import StartupCard from "@/components/startup/StartupCard";
import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminStartupsPage() {
  const role = await getUserRole();
  if (role !== "admin" && role !== "gestor") redirect("/");

  return (
    <div className="p-4">
      <StartupCard role={role} />
    </div>
  );
}
