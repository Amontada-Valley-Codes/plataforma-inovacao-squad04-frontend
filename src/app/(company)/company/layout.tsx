"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";

export default function CompanyGroupLayout({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar */}
      <AppSidebar />

      {/* Backdrop apenas no mobile */}
      {isMobileOpen && <Backdrop aria-hidden />}

      {/* Área principal */}
      <div
        className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header fixo em telas pequenas */}
        <div className="sticky top-0 z-40 bg-white dark:bg-gray-900/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-gray-900/70">
          <AppHeader />
        </div>

        {/* Conteúdo */}
        <div className="p-3 sm:p-4 md:p-6 mx-auto w-full max-w-screen-2xl overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
