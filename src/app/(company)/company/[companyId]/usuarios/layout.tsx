import ChallengeFilter from "@/components/header/ChallengeFilter";
import React from "react";
 // ou o nome do teu topo global

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full min-h-screen">
        <ChallengeFilter showAddButtons={false} />
      <main className="flex-1 w-full min-w-0 px-2 sm:px-4 md:px-6 pt-4 pb-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
