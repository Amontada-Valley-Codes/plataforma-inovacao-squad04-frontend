"use client";
import AddUsersButton from "@/components/AddUsersButton";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import React, { useState, useEffect, useRef } from "react";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
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
    <header className="sticky top-0 z-[9999] w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex w-full items-center justify-between px-3 py-1.5 lg:px-5 lg:py-2">
        {/* Esquerda: menu + busca (desktop) */}
        <div className="flex min-w-0 items-center gap-2">
          <button
            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.583 1c0-.414.336-.75.75-.75h13.333c.415 0 .75.336.75.75s-.335.75-.75.75H1.333c-.414 0-.75-.336-.75-.75Zm0 10c0-.414.336-.75.75-.75h13.333c.415 0 .75.336.75.75s-.335.75-.75.75H1.333c-.414 0-.75-.336-.75-.75ZM1.333 5.25c-.414 0-.75.336-.75.75s.336.75.75.75H8c.414 0 .75-.336.75-.75S8.414 5.25 8 5.25H1.333Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>

          {/* Barra de pesquisa (desktop) */}
          <div className="hidden lg:block min-w-[280px]">
            <form className="w-full">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                  <svg
                    className="fill-gray-500 dark:fill-gray-400"
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.042 9.374a6.333 6.333 0 1 1 12.666 0 6.333 6.333 0 0 1-12.666 0Zm6.333-7.832a7.833 7.833 0 1 0 5.0 13.875l2.82 2.82a.75.75 0 1 0 1.06-1.06l-2.82-2.821A7.833 7.833 0 0 0 9.375 1.542Z"
                    />
                  </svg>
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Pesquisa"
                  className="h-9 w-[360px] rounded-[10px] border border-gray-200 bg-transparent pl-10 pr-3 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Direita: ações */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggleButton />
          <NotificationDropdown />
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
        {/* Se quiser ter busca no mobile também, descomente abaixo */}
        {/* <form className="w-full">
          <input
            ref={inputRef}
            type="text"
            placeholder="Pesquisa"
            className="h-9 w-full rounded-[10px] border border-gray-200 bg-transparent px-10 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </form> */}
      </div>
    </header>
  );
};

export default AppHeader;
