"use client";

import { useState, useEffect } from "react";
import CompanyHistory from "@/components/history/CompanyHistory";
import { getCurrentUser } from "@/lib/auth";

export default function AdminHistoryPage() {
  const [user, setUser] = useState(getCurrentUser);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  if (!user) {
    return <div className="w-full p-6 text-sm text-gray-500">Carregando...</div>;
  }

  return (
    <div className="space-y-4 px-3 sm:px-4 md:px-6 lg:px-8 py-4">
      <div className="text-xs sm:text-sm text-muted-foreground flex flex-wrap gap-1">
        <span>Admin /</span>
        <span className="font-semibold truncate">Histórico</span>
      </div>

      <div className="w-full overflow-x-auto">
        <CompanyHistory role={user.role} viewerUserId={user.id} />
      </div>
    </div>
  );
}