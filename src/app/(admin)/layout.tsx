"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Ajuste de margem principal para diferentes larguras de tela
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar e Backdrop */}
      <AppSidebar />
      <Backdrop />

      {/* Área Principal */}
      <div
        className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header fixo no topo em telas pequenas */}
        <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <AppHeader />
        </div>

        {/* Conteúdo da Página */}
        <div className="mx-auto w-full max-w-screen-2xl px-3 md:px-5 py-2 md:py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
