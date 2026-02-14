"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { LayoutProps } from "../(admin)/layout";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: LayoutProps) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const pathname = usePathname()
  const titles: Record<string, string> = {
    "/startup/desafios": "Desafios",
    "/startup/historico": "Histórico",
    "/startup/my-startup": "Minha Startup",
  }
  const title = titles[pathname] ?? "Página"

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />

      {/* Main Content Area */}
      <div
        className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header (fixo no topo em telas menores) */}
        <div className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur">
          <AppHeader title={title}/>
        </div>

        {/* Page Content */}
        <div className="p-3 sm:p-4 md:p-6 mx-auto w-full max-w-screen-2xl overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
