"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  Building2Icon,
  ClipboardListIcon,
  Grid2x2Icon,
  GripHorizontalIcon,
  HistoryIcon,
  RocketIcon,
  SquareKanban,
} from "lucide-react";
import { extractCompanyIdFromPath } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";

type RoleEn =
  | "admin"
  | "gestor"
  | "avaliador"
  | "usuario"
  | "startup"
  | "steering_committee"
  | "observer"
  | "innovation_team"
  | "organizer"
  | "collaborator";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

function useCurrentRole() {
  const [role, setRole] = useState<RoleEn>("usuario");
  const [companyIdFromToken, setCompanyIdFromToken] = useState<string | null>(null);
  const [startupIdFromToken, setStartupIdFromToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
  (async () => {
    try {
      const u = await getCurrentUser();

      console.log("USER RETORNADO:", u);

      if (!u) return;

      const backendRole = (u.role ?? u.type_user ?? "usuario").toUpperCase();

const roleMap: Record<string, RoleEn> = {
  ADMIN: "admin",
  GESTOR: "gestor",
  AVALIADOR: "avaliador",
  USUARIO: "usuario",
  STARTUP: "startup",
  STEERING_COMMITTEE: "steering_committee",
  OBSERVER: "observer",
  INNOVATION_TEAM: "innovation_team",
  ORGANIZER: "organizer",
  COLLABORATOR: "collaborator",
};

setRole(roleMap[backendRole] ?? "usuario");


      if (u.companyId) setCompanyIdFromToken(String(u.companyId));
      if (u.startupId) setStartupIdFromToken(String(u.startupId));
    } catch (e) {
      console.error("getCurrentUser failed:", e);
    } finally {
      setReady(true);
    }
  })();
}, []);


  return { role, companyIdFromToken, startupIdFromToken, ready };
}

// Sidebar é somente UX. Segurança real = middleware + backend.
function buildNavItems(
  role: RoleEn,
  pathname: string,
  companyIdFromToken: string | null,
  startupIdFromToken: string | null
): NavItem[] {

  const effectiveCompanyId = companyIdFromToken ?? null;

  // ================= ADMIN =================
  if (role === "admin") {
    return [
      { icon: <Grid2x2Icon />, name: "Dashboard", path: "/admin/dashboard" },
      { icon: <ClipboardListIcon />, name: "Desafios", path: "/admin/challenges" },
      { icon: <RocketIcon />, name: "Startups", path: "/admin/startups" },
      { icon: <Building2Icon />, name: "Empresas", path: "/admin/companies" },
      { icon: <HistoryIcon />, name: "Histórico", path: "/admin/history" },
    ];
  }

  // ================= STARTUP =================
  if (role === "startup") {
    return [
      { icon: <Grid2x2Icon />, name: "Desafios Públicos", path: "/startup/desafios" },
      { icon: <RocketIcon />, name: "Startup", path: "/startup/my-startup" },
      { icon: <HistoryIcon />, name: "Histórico", path: "/startup/historico" },
    ];
  }

  // ================= COLLABORATOR =================
  if (role === "collaborator") {
    return [
      { icon: <Grid2x2Icon />, name: "Meus Desafios", path: "/user/meus-desafios" },
      { icon: <HistoryIcon />, name: "Histórico", path: "/user/historico" },
    ];
  }

  // Se não tiver empresa vinculada ainda
  if (!effectiveCompanyId) {
    return [];
  }

  const base = `/company/${effectiveCompanyId}`;

  // ================= STEERING =================
  if (role === "steering_committee") {
    return [
      { icon: <Grid2x2Icon />, name: "Dashboard", path: `${base}/dashboard` },
      { icon: <ClipboardListIcon />, name: "Desafios", path: `${base}/desafios` },
      { icon: <SquareKanban />, name: "Funil", path: `${base}/kanban` },
      { icon: <HistoryIcon />, name: "Histórico", path: `${base}/history` },
      { icon: <Building2Icon />, name: "Minha Empresa", path: `${base}/empresa` },
    ];
  }

  // ================= OBSERVER =================
  if (role === "observer") {
    return [
      { icon: <ClipboardListIcon />, name: "Desafios", path: `${base}/desafios` },
      { icon: <SquareKanban />, name: "Funil", path: `${base}/kanban` },
      { icon: <HistoryIcon />, name: "Histórico", path: `${base}/history` },
      { icon: <Building2Icon />, name: "Minha Empresa", path: `${base}/empresa` },
    ];
  }

  // ================= INNOVATION OFFICE / ORGANIZER =================
  if (role === "innovation_team" || role === "organizer") {
    return [

      { icon: <Grid2x2Icon />, name: "Dashboard", path: `${base}/dashboard` },
      { icon: <ClipboardListIcon />, name: "Desafios", path: `${base}/desafios` },
      { icon: <SquareKanban />, name: "Funil", path: `${base}/kanban` },
      { icon: <HistoryIcon />, name: "Histórico", path: `${base}/history` },
      { icon: <Building2Icon />, name: "Minha Empresa", path: `${base}/empresa` },
      { icon: <Building2Icon />, name: "Usuários", path: `${base}/usuarios` },
    ];
  }

  // ================= GESTOR =================
  if (role === "gestor") {
    return [
      { icon: <Grid2x2Icon />, name: "Dashboard", path: `${base}/dashboard` },
      { icon: <ClipboardListIcon />, name: "Desafios", path: `${base}/desafios` },
      { icon: <SquareKanban />, name: "Funil", path: `${base}/kanban` },
      { icon: <Building2Icon />, name: "Minha Empresa", path: `${base}/empresa` },
      { icon: <HistoryIcon />, name: "Histórico", path: `${base}/history` },
      { icon: <Building2Icon />, name: "Usuários", path: `${base}/usuarios` },
    ];
  }

  // ================= AVALIADOR =================
  if (role === "avaliador") {
    return [
      { icon: <ClipboardListIcon />, name: "Desafios", path: `${base}/desafios` },
      { icon: <SquareKanban />, name: "Funil", path: `${base}/kanban` },
      { icon: <Building2Icon />, name: "Minha Empresa", path: `${base}/empresa` },
      { icon: <HistoryIcon />, name: "Histórico", path: `${base}/history` },
    ];
  }

  return [
    { icon: <Building2Icon />, name: "Minha Empresa", path: `${base}/empresa` },
  ];
}

function isBaseRoute(path: string) {
  return path.split("/").filter(Boolean).length === 1;
}

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const { role, companyIdFromToken, startupIdFromToken, ready } = useCurrentRole();

  const navItems = useMemo(() => {
    if (!ready) return [];
      return buildNavItems(role, pathname, companyIdFromToken, startupIdFromToken);
  }, [ready, role, pathname, companyIdFromToken, startupIdFromToken]);


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
                href={nav.path}
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
        className={`fixed max-[409px]:mt-17 max-xsm:mt-14 xsm:mt-14 flex flex-col lg:mt-0 top-0 ${isCompact ? "px-0" : "px-5"} left-0
        bg-[#15358d] dark:bg-gray-900 dark:border-gray-800 text-white h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 lg:rounded-r-2xl
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="py-8 flex justify-center">
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
                style={{ height: "auto" }}
              />
            )}
          </Link>
        </div>

        <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
          <nav className="mb-6">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-white ${isCompact ? "justify-center" : "justify-start"}`}>
                  {isExpanded || isHovered || isMobileOpen ? "" : <GripHorizontalIcon />}
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
