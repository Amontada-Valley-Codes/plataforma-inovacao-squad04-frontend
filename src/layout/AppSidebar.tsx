"use client";

import React, { useMemo, useCallback, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  Building2Icon,
  ClipboardListIcon,
  Grid2x2Icon,
  GripHorizontalIcon,
  HandshakeIcon,
  HistoryIcon,
  RocketIcon,
  SquareKanban,
  UsersIcon,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import type { Role } from "@/lib/roles";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

// ─── Itens do menu por role ───────────────────────────────────────────────────

function buildNavItems(
  role: Role,
  enterpriseId: string | null,
  startupId: string | null
): NavItem[] {
  switch (role) {
    case "ADMINISTRATOR":
      return [
        { icon: <Grid2x2Icon />, name: "Dashboard", path: "/admin/dashboard" },
        { icon: <ClipboardListIcon />, name: "Desafios", path: "/admin/challenges" },
        { icon: <RocketIcon />, name: "Startups", path: "/admin/startups" },
        { icon: <Building2Icon />, name: "Empresas", path: "/admin/companies" },
        { icon: <HistoryIcon />, name: "Histórico", path: "/admin/history" },
      ];

    case "STARTUP": {
      const base = startupId ? `/startup/${startupId}` : "/startup";
      return [
        { icon: <Grid2x2Icon />, name: "Desafios Públicos", path: `${base}/desafios` },
        { icon: <HandshakeIcon />, name: "Meus Matches", path: `${base}/meus-matches` },
        { icon: <RocketIcon />, name: "Minha Startup", path: `${base}/my-startup` },
        { icon: <HistoryIcon />, name: "Histórico", path: `${base}/historico` },
      ];
    }

    case "MANAGER": {
      if (!enterpriseId) return [];
      const base = `/company/${enterpriseId}`;
      return [
        { icon: <Grid2x2Icon />, name: "Dashboard", path: `${base}/dashboard` },
        { icon: <ClipboardListIcon />, name: "Desafios", path: `${base}/desafios` },
        { icon: <SquareKanban />, name: "Funil", path: `${base}/kanban` },
        { icon: <Building2Icon />, name: "Minha Empresa", path: `${base}/empresa` },
        { icon: <HistoryIcon />, name: "Histórico", path: `${base}/history` },
        { icon: <UsersIcon />, name: "Usuários", path: `${base}/usuarios` },
      ];
    }

    case "INNOVATION_TEAM":
    case "TRANSFORMATION_OFFICE": {
      if (!enterpriseId) return [];
      const base = `/company/${enterpriseId}`;
      return [
        { icon: <Grid2x2Icon />, name: "Dashboard", path: `${base}/dashboard` },
        { icon: <ClipboardListIcon />, name: "Desafios", path: `${base}/desafios` },
        { icon: <SquareKanban />, name: "Funil", path: `${base}/kanban` },
        { icon: <HistoryIcon />, name: "Histórico", path: `${base}/history` },
        { icon: <Building2Icon />, name: "Minha Empresa", path: `${base}/empresa` },
        { icon: <UsersIcon />, name: "Usuários", path: `${base}/usuarios` },
      ];
    }

    case "STEERING_COMMITTEE": {
      if (!enterpriseId) return [];
      const base = `/company/${enterpriseId}`;
      return [
        { icon: <Grid2x2Icon />, name: "Dashboard", path: `${base}/dashboard` },
        { icon: <ClipboardListIcon />, name: "Desafios", path: `${base}/desafios` },
        { icon: <SquareKanban />, name: "Funil", path: `${base}/kanban` },
        { icon: <HistoryIcon />, name: "Histórico", path: `${base}/history` },
        { icon: <Building2Icon />, name: "Minha Empresa", path: `${base}/empresa` },
      ];
    }

    case "OBSERVER": {
      if (!enterpriseId) return [];
      const base = `/company/${enterpriseId}`;
      return [
        { icon: <ClipboardListIcon />, name: "Desafios", path: `${base}/desafios` },
        { icon: <SquareKanban />, name: "Funil", path: `${base}/kanban` },
        { icon: <HistoryIcon />, name: "Histórico", path: `${base}/history` },
        { icon: <Building2Icon />, name: "Minha Empresa", path: `${base}/empresa` },
      ];
    }

    case "COLLABORATOR": {
      if (!enterpriseId) return [];
      const base = `/company/${enterpriseId}`;
      return [
        { icon: <ClipboardListIcon />, name: "Meus Desafios", path: `${base}/desafios` },
        { icon: <HistoryIcon />, name: "Histórico", path: `${base}/history` },
      ];
    }

    default:
      return [];
  }
}

// ─── Componente ───────────────────────────────────────────────────────────────

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  // getCurrentUser lê document.cookie — só existe no cliente.
  // Inicializamos como null e populamos após mount para evitar hydration mismatch.
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const navItems = useMemo(() => {
    if (!user) return [];
    return buildNavItems(
      user.role,
      user.enterpriseId ?? null,
      user.startupId ?? null
    );
  }, [user]);

  const isActive = useCallback(
    (path: string) => {
      const depth = path.split("/").filter(Boolean).length;
      return depth === 1
        ? pathname === path
        : pathname === path || pathname.startsWith(path + "/");
    },
    [pathname]
  );

  const styleVar = { ["--azul" as string]: "#15358D" } as React.CSSProperties;
  const isCompact = !(isExpanded || isHovered || isMobileOpen);

  const linkBase = [
    "group rounded-xl transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
    isCompact
      ? "grid place-items-center w-12 h-12 mx-auto"
      : "flex items-center w-full gap-3 px-4 pt-2 pb-[12px]",
  ].join(" ");

  const linkActive = "bg-white text-[var(--azul)]";
  const linkInactive = "text-white hover:text-[var(--azul)] hover:bg-white";

  const iconCls = (active: boolean) =>
    [
      "block size-5 transition-colors duration-200 sidebar-current",
      active ? "text-[var(--azul)]" : "text-white group-hover:text-[var(--azul)]",
    ].join(" ");

  return (
    <>
      <aside
        className={`fixed max-[409px]:mt-17 max-xsm:mt-14 xsm:mt-14 flex flex-col lg:mt-0 top-0
          ${isCompact ? "px-0" : "px-5"} left-0
          bg-[#15358d] dark:bg-gray-900 dark:border-gray-800 text-white h-screen
          transition-all duration-300 ease-in-out z-50 border-r border-gray-200 lg:rounded-r-2xl
          ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo */}
        <div className="py-8 flex justify-center">
          <Link href="/">
            <Image
              src="/images/logo/ninna-logo.svg"
              alt="Logo"
              width={isCompact ? 32 : 85}
              height={isCompact ? 32 : 40}
              priority
              style={{ height: "auto" }}
            />
          </Link>
        </div>

        {/* Navegação */}
        <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
          <nav className="mb-6">
            <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-white ${isCompact ? "justify-center" : "justify-start"}`}>
              {isCompact && <GripHorizontalIcon />}
            </h2>
            <ul className={`flex flex-col gap-4 ${isCompact ? "items-center" : ""}`}>
              {navItems.map((nav) => {
                const active = isActive(nav.path);
                return (
                  <li key={nav.path} className={isCompact ? "" : "w-full"}>
                    <Link
                      href={nav.path}
                      className={`${linkBase} ${active ? linkActive : linkInactive}`}
                      style={styleVar}
                      aria-current={active ? "page" : undefined}
                    >
                      <span className={iconCls(active)}>{nav.icon}</span>
                      {!isCompact && (
                        <span className="text-sm font-medium">{nav.name}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      <style jsx>{`
        :global(.sidebar-current svg) { color: currentColor; }
        :global(.sidebar-current svg [stroke]) { stroke: currentColor !important; }
        :global(.sidebar-current svg [fill]:not([fill="none"])) { fill: currentColor !important; }
      `}</style>
    </>
  );
};

export default AppSidebar;