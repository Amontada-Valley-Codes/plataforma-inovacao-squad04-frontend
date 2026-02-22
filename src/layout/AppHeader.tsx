"use client";
import AddUsersButton from "@/components/AddUsersButton";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import UserDropdown from "@/components/header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import { Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

type AppHeaderProps = {
  title?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title }) => {
  const [isApplicationMenuOpen] = useState(false);
  const { isMobileOpen, isExpanded, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex w-full items-center justify-between px-3 py-1.5 lg:px-5 lg:py-2">
        {/* Esquerda: menu + busca (desktop) */}
        <div className="flex min-w-0 items-center gap-2">
          <button
            className="flex lg:hidden h-7 w-7 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <X/>
            ) : (
              <Menu/>
            )}
          </button>

          <button
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isExpanded ? (
              <PanelLeftClose size={20}/>
            ) : (
              <PanelLeftOpen size={20}/>
            )}
          </button>

          {/* Barra de pesquisa (desktop) */}
          <p className="font-semibold text-gray-700 text-lg">{title}</p>
        </div>

        {/* Direita: ações */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggleButton />
          <AddUsersButton />
          <UserDropdown />
        </div>
      </div>

      {/* Linha extra do menu (mobile) */}
      <div
        className={`${
          isApplicationMenuOpen ? "flex" : "hidden"
        } w-full items-center justify-between gap-2 px-3 py-1.5 lg:hidden shadow-theme-md`}
      >
        <p>{title}</p>
      </div>
    </header>
  );
};

export default AppHeader;
