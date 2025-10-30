/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  GridIcon,
  HorizontaLDots,
  ClipboardDocumentListIcon,
  HistoryIcon,
  RocketLaunchIcon,
  BuildingOffice2Icon,
} from "../icons/index";
import { SquareKanban } from "lucide-react";
import { extractCompanyIdFromPath } from "@/lib/utils";

type Role = "admin" | "gestor" | "avaliador" | "usuario" | "startup";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

function appendSearch(path: string, search: string) {
  if (!search) return path;
  const hasQuery = path.includes("?");
  const sep = hasQuery ? "&" : "?";
  return `${path}${sep}${search.replace(/^\?/, "")}`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function selectSearchFor(path: string, _currentSearch: string, role: Role) {
  if (path.startsWith("/admin")) return "?role=admin";
  return "";
}

/** Lê a role a partir de ?role= (para testes), do JWT (access_token) ou do localStorage – apenas no client (useEffect). */
function useCurrentRole(): Role {
  const [role, setRole] = useState<Role>("usuario");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const allowed: Role[] = ["admin", "gestor", "avaliador", "usuario", "startup"];

    // 1) ?role= (útil para testes)
    const params = new URLSearchParams(window.location.search);
    const urlRole = params.get("role") as Role | null;
    if (urlRole && allowed.includes(urlRole)) {
      localStorage.setItem("role", urlRole);
      setRole(urlRole);
      return;
    }

    // 2) Tenta decodificar a role do JWT salvo no login
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const [, payload] = token.split(".");
        if (payload) {
          const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
          const decoded = JSON.parse(json) as { type_user?: string };
          const type = String(decoded?.type_user || "").toUpperCase();
          const map: Record<string, Role> = {
            ADMINISTRATOR: "admin",
            MANAGER: "gestor",
            EVALUATOR: "avaliador",
            COMMON: "usuario",
            STARTUP: "startup",
          };
          const r = map[type] ?? "usuario";
          localStorage.setItem("role", r);
          setRole(r);
          return;
        }
      } catch {
        // ignore
      }
    }

    // 3) Fallback no que já estiver salvo (ou "usuario")
    const stored = localStorage.getItem("role") as Role | null;
    setRole(stored && allowed.includes(stored) ? stored : "usuario");
  }, []);

  return role;
}

function buildNavItems(role: Role, pathname: string, companyIdFromToken: string | null): NavItem[] {

  if (pathname.startsWith("/challenges-publicos")) {
    return [
      { icon: <GridIcon />, name: "Desafios Públicos", path: "/challenges-publicos" },
      { icon: <RocketLaunchIcon />, name: "Startup", path: "/startup/my-startup" },
      { icon: <HistoryIcon />, name: "Histórico", path: "/startup/historico" },
    ];
  }
  
  let companyId = extractCompanyIdFromPath(pathname);
  if (!companyId && companyIdFromToken) {
    companyId = companyIdFromToken;
  }

  if (role === "admin") {
    return [
      { icon: <GridIcon />, name: "Dashboard", path: "/admin/dashboard" },
      { icon: <ClipboardDocumentListIcon />, name: "Desafios", path: "/admin/challenges" },
      { icon: <RocketLaunchIcon />, name: "Startups", path: "/admin/startups" },
      { icon: <BuildingOffice2Icon />, name: "Empresas", path: "/admin/companies" },
      { icon: <HistoryIcon />, name: "Histórico", path: "/admin/history" },
    ];
  }

  // STARTUP sem contexto de empresa
  if (!companyId && role === "startup") {
    return [
      { icon: <GridIcon />, name: "Desafios Públicos", path: "/startup/desafios" },
      { icon: <RocketLaunchIcon />, name: "Startup", path: "/startup/my-startup" },
      { icon: <HistoryIcon />, name: "Histórico", path: "/startup/historico" },
    ];
  }

  // Sem companyId na rota nem no token
  if (!companyId) {
    if (role === "gestor") {
      return [
        { icon: <BuildingOffice2Icon />, name: "Minha Empresa", path: "/company" },
        { icon: <ClipboardDocumentListIcon />, name: "Desafios", path: "/company/desafios" },
        { icon: <HistoryIcon />, name: "Histórico", path: "/company/history" },
      ];
    }
    if (role === "usuario") {
      return [
        { icon: <GridIcon />, name: "Meus Desafios", path: "/user/meus-desafios" },
        { icon: <BuildingOffice2Icon />, name: "Minha Empresa", path: "/user/empresa" },
        { icon: <HistoryIcon />, name: "Histórico", path: "/user/historico" },
      ];
    }
    return [{ icon: <BuildingOffice2Icon />, name: "Minhas Empresas", path: "/admin/companies" }];
  }

  // Com companyId
  const base = `/company/${companyId}`;

  if (role === "gestor") {
    return [
      { icon: <GridIcon />, name: "Dashboard", path: `${base}/dashboard` },
      { icon: <ClipboardDocumentListIcon />, name: "Desafios", path: `${base}/desafios` },
      { icon: <SquareKanban />, name: "Funil", path: `${base}/kanban` },
      { icon: <BuildingOffice2Icon />, name: "Minha Empresa", path: `${base}/empresa` },
      { icon: <RocketLaunchIcon />, name: "Startups", path: `${base}/startups` },
      { icon: <HistoryIcon />, name: "Histórico", path: `${base}/history` },
      { icon: <BuildingOffice2Icon />, name: "Usuários", path: `${base}/usuarios` },
    ];
  }

  if (role === "avaliador") {
    return [
      { icon: <ClipboardDocumentListIcon />, name: "Desafios", path: `${base}/desafios` },
      { icon: <SquareKanban />, name: "Funil", path: `${base}/kanban` },
      { icon: <BuildingOffice2Icon />, name: "Minha Empresa", path: `${base}/empresa` },
      { icon: <HistoryIcon />, name: "Histórico", path: `${base}/history` },
    ];
  }

  // Usuário comum (ou fallback com companyId)
  return [
    { icon: <GridIcon />, name: "Meus Desafios", path: "/user/meus-desafios" },
    { icon: <BuildingOffice2Icon />, name: "Minha Empresa", path: "/user/empresa" },
    { icon: <HistoryIcon />, name: "Histórico", path: "/user/historico" },
  ];
}

function isBaseRoute(path: string) {
  return path.split("/").filter(Boolean).length === 1;
}

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const role = useCurrentRole();

  const [companyIdFromToken, setCompanyIdFromToken] = useState<string | null>(null);
  useEffect(() => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      const [, payload] = token.split(".");
      if (!payload) return;
      // base64url → base64
      const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
      const decoded = JSON.parse(json) as { enterpriseId?: string | null };
      if (decoded?.enterpriseId) setCompanyIdFromToken(String(decoded.enterpriseId));
    } catch {
      // ignore
    }
  }, []);


  const [searchSuffix, setSearchSuffix] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") setSearchSuffix(window.location.search || "");
  }, [pathname]);

  const navItems = useMemo(
    () => buildNavItems(role, pathname, companyIdFromToken),
    [role, pathname, companyIdFromToken]
  );

  const isActive = useCallback(
    (path: string) => {
      if (isBaseRoute(path)) return pathname === path;
      return pathname === path || pathname.startsWith(path + "/");
    },
    [pathname]
  );

  const styleVar = React.useMemo(
    () => ({ ["--azul" as any]: "#15358D" } as React.CSSProperties),
    []
  );

  const isCompact = !(isExpanded || isHovered || isMobileOpen);

  const linkBase = [
    "group rounded-xl transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#15358d]",
    isCompact ? "grid place-items-center w-12 h-12 mx-auto" : "flex items-center w-full gap-3 px-4 py-2",
  ].join(" ");

  const linkActive = "bg-white text-[var(--azul)]";
  const linkInactive = "text-white hover:text-[var(--azul)] hover:bg-white";

  const iconCls = (active: boolean) =>
    [
      "block size-5 transition-colors duration-200 sidebar-current",
      active ? "text-[var(--azul)]" : "text-white group-hover:text-[var(--azul)]",
    ].join(" ");

  const textCls = "text-sm font-medium";

  const renderMenuItems = (items: NavItem[]) => (
    <ul className={`flex flex-col gap-4 ${isCompact ? "items-center" : ""}`}>
      {items.map((nav, index) => {
        const active = !!nav.path && isActive(nav.path);
        return (
          <li key={`${nav.name}-${index}`} className={isCompact ? "" : "w-full"}>
            {nav.path && (
              <Link
                href={appendSearch(nav.path, selectSearchFor(nav.path, searchSuffix, role))}
                className={`${linkBase} ${active ? linkActive : linkInactive}`}
                style={styleVar}
                aria-current={active ? "page" : undefined}
              >
                <span className={iconCls(active)}>{nav.icon}</span>
                {!isCompact && <span className={textCls}>{nav.name}</span>}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <aside
        className={`fixed mt-16 flex flex-col lg:mt-0 top-0 ${isCompact ? "px-0" : "px-5"} left-0
        bg-[#15358d] dark:bg-gray-900 dark:border-gray-800 text-white h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 rounded-r-2xl
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo */}
        <div className={`py-8 flex justify-center`}>
          <Link href="/">
            {isExpanded || isHovered || isMobileOpen ? (
              <>
                <Image className="dark:hidden" src="/images/logo/ninna-logo.svg" alt="Logo" width={85} height={40} priority />
                <Image className="hidden dark:block" src="/images/logo/ninna-logo.svg" alt="Logo" width={85} height={40} priority />
              </>
            ) : (
              <Image
                src="/images/logo/ninna-logo.svg"
                alt="Logo"
                width={32}
                height={32}
                priority
                style={{ height: "auto" }} // evita warning de proporção
              />
            )}
          </Link>
        </div>

        {/* Navegação */}
        <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
          <nav className="mb-6">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-white ${isCompact ? "justify-center" : "justify-start"}`}>
                  {isExpanded || isHovered || isMobileOpen ? "" : <HorizontaLDots />}
                </h2>
                {renderMenuItems(navItems)}
              </div>
            </div>
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
