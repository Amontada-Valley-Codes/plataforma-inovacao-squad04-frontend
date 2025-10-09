"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
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

/** Papéis suportados */
type Role = "admin" | "gestor" | "avaliador" | "usuario" | "startup";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

/* Preserva a query atual (?role=..., ?userId=..., etc.) */
function appendSearch(path: string, search: string) {
  if (!search) return path;
  const hasQuery = path.includes("?");
  const sep = hasQuery ? "&" : "?";
  return `${path}${sep}${search.replace(/^\?/, "")}`;
}

/** Lê a role via URL (?role=...), localStorage ou fallback */
function useCurrentRole(): Role {
  const [role, setRole] = useState<Role>("usuario");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const allowed: Role[] = ["admin", "gestor", "avaliador", "usuario", "startup"];
    const params = new URLSearchParams(window.location.search);
    const urlRole = params.get("role") as Role | null;

    if (urlRole && allowed.includes(urlRole)) {
      localStorage.setItem("role", urlRole);
      setRole(urlRole);
      return;
    }

    const stored = localStorage.getItem("role") as Role | null;
    if (stored && allowed.includes(stored)) {
      setRole(stored);
      return;
    }

    setRole("usuario");
  }, []);

  return role;
}

/** Monta o menu conforme papel + URL atual */
function buildNavItems(role: Role, pathname: string): NavItem[] {
  const companyId = extractCompanyIdFromPath(pathname);

  // ADMIN (ecossistema global)
  if (role === "admin") {
    return [
      { icon: <GridIcon />, name: "Dashboard", path: "/admin/dashboard" },
      { icon: <ClipboardDocumentListIcon />, name: "Desafios", path: "/admin/challenges" },
      { icon: <RocketLaunchIcon />, name: "Startups", path: "/admin/startups" },
      { icon: <BuildingOffice2Icon />, name: "Empresas", path: "/admin/companies" },
      { icon: <HistoryIcon />, name: "Histórico", path: "/admin/history" },
    ];
  }

  // STARTUP (global, fora de /company)
  if (!companyId && role === "startup") {
    return [
      { icon: <GridIcon />, name: "Desafios Públicos", path: "/startup/desafios" },
      { icon: <RocketLaunchIcon />, name: "Startup", path: "/startup" },
      { icon: <HistoryIcon />, name: "Histórico", path: "/startup/historico" },
    ];
  }

  // Fora do contexto de empresa para os demais papéis
  if (!companyId) {
    if (role === "usuario") {
      return [
        { icon: <GridIcon />, name: "Meus Desafios", path: "/user/meus-desafios" },
        { icon: <BuildingOffice2Icon />, name: "Minha Empresa", path: "/user/empresa" },
        { icon: <HistoryIcon />, name: "Histórico", path: "/user/historico" },
      ];
    }
    // gestor/avaliador sem empresa → seleção de empresas
    return [{ icon: <BuildingOffice2Icon />, name: "Minhas Empresas", path: "/admin/companies" }];
  }

  // Dentro de /company/:companyId/...
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

  // USUÁRIO (submitter) dentro da empresa
  return [
    { icon: <BuildingOffice2Icon />, name: "Empresa", path: `${base}` },
    { icon: <ClipboardDocumentListIcon />, name: "Desafios", path: `${base}/desafios` },
    { icon: <ClipboardDocumentListIcon />, name: "Meus Desafios", path: `/user/meus-desafios` },
  ];
}

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const role = useCurrentRole();

  // guarda o search atual (?role=..., ?userId=..., etc.)
  const [searchSuffix, setSearchSuffix] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSearchSuffix(window.location.search || "");
    }
  }, [pathname]);

  // monta menu conforme papel + URL
  const navItems = useMemo(() => buildNavItems(role, pathname), [role, pathname]);

  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main"; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => pathname === path || pathname.startsWith(path + "/"),
    [pathname]
  );

  const renderMenuItems = (items: NavItem[], menuType: "main") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={`${nav.name}-${index}`}>
          {nav.path && (
            <Link
              href={appendSearch(nav.path, searchSuffix)}
              className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}
            >
              <span className={`${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
            </Link>
          )}

          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={appendSearch(subItem.path, searchSuffix)}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`${
                              isActive(subItem.path) ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`${
                              isActive(subItem.path) ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-[#15358d] dark:bg-gray-900 dark:border-gray-800 text-white h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 rounded-r-2xl
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-center"}`}>
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image className="dark:hidden" src="/images/logo/ninna-logo.svg" alt="Logo" width={85} height={40} priority />
              <Image className="hidden dark:block" src="/images/logo/logo-dark.svg" alt="Logo" width={85} height={40} priority />
            </>
          ) : (
            <Image src="/images/logo/ninna-logo.svg" alt="Logo" width={32} height={32} priority />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-white ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "" : <HorizontaLDots />}
              </h2>

              {/* MENU DINÂMICO */}
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
