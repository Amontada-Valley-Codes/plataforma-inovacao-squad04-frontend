// src/components/startup/StartupCard.tsx
"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  List as ListIcon,
  MoreHorizontal,
  Calendar,
  Settings,
} from "lucide-react";
import { useModal } from "@/hooks/useModal";
import StartupProfile from "./StartupProfile";
import { startupService } from "@/api/services/startup.service";
import { ShowAllStartupsResponse } from "@/api/payloads/startup.payload";
import { useStore } from "../../../store";

type Role = "admin" | "gestor" | "avaliador" | "usuario";

type Props = {
  role?: Role;
  viewerCompanyId?: number;
  companyIdFilter?: string | number;
  title?: string;
  autoOpen?: boolean;
};

export default function StartupCard({
  role = "admin",
  viewerCompanyId,
  companyIdFilter,
  title = "Startups",
  autoOpen = false,
}: Props) {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedStartup, setSelectedStartup] = useState<ShowAllStartupsResponse | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [startups, setStartups] = useState<ShowAllStartupsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { reload } = useStore();

  // --- Carregar startups da API ---

  async function fetchStartups() {
    try {
      setLoading(true);
      const response = await startupService.showAllStartups();
      setStartups(response);
    } catch (error) {
      console.error("Erro ao buscar startups:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStartups();
  }, [reload])

  // --- Filtrar startups conforme role e empresa ---
  const filtered = useMemo(() => {
    const byCompany = startups;

    const canSeeAll = role === "admin" || role === "gestor";
    if (canSeeAll) return byCompany;

    if (viewerCompanyId == null) return [];
    return byCompany;
  }, [startups, role, viewerCompanyId, companyIdFilter]);

  // --- Animação suave da altura ---
  const listRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number | undefined>(undefined);

  const recalcHeight = useCallback(() => {
    const activeEl = viewMode === "list" ? listRef.current : gridRef.current;
    if (!activeEl) return;
    setContainerHeight(activeEl.scrollHeight);
  }, [viewMode]);

  useEffect(() => {
    requestAnimationFrame(recalcHeight);
  }, [viewMode, filtered, recalcHeight]);

  useEffect(() => {
    const onResize = () => recalcHeight();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [recalcHeight]);

  useEffect(() => {
    if (autoOpen && filtered[0]) {
      setSelectedStartup(filtered[0]);
    }
  }, [autoOpen, filtered]);

  // --- Loading ---
  if (loading) {
    return (
      <div className="w-full p-6 text-sm text-gray-500 dark:text-[#ced3db]">
        Carregando startups...
      </div>
    );
  }

  if (!filtered.length) {
    return (
      <div className="w-full p-6 text-sm text-gray-500 dark:text-[#ced3db]">
        Nenhuma startup encontrada
        {role === "admin" || role === "gestor" ? "" : " para sua empresa"}.
      </div>
    );
  }

  // --- Comportamento ao clicar ---
  const wrapIfNeeded = (
    startup: ShowAllStartupsResponse,
    children: React.ReactNode,
  ) => {
    if (role === "admin") {
      const handlers = {
        onClick: () => {
          setSelectedStartup(startup);
          openModal();
        },
        onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key === "Enter" || e.key === " ") {
            setSelectedStartup(startup);
            openModal();
          }
        },
        role: "button" as const,
        tabIndex: 0,
      };
      return <div {...handlers}>{children}</div>;
    }
    return (
      <Link href={`/startup/${startup.id}?role=${role}`} className="block" prefetch={false}>
        {children}
      </Link>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-semibold text-slate-900 dark:text-gray-100">
          {title}
        </h2>

        <button
          type="button"
          onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
          className="inline-flex items-center justify-center rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800 p-2 transition-all duration-200 ease-out"
          aria-label="Alternar visualização"
          title={viewMode === "list" ? "Ver em cards" : "Ver em lista"}
        >
          {viewMode === "list" ? (
            <LayoutGrid size={18} className="text-gray-700 dark:text-gray-300" />
          ) : (
            <ListIcon size={18} className="text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>

      <div
        ref={containerRef}
        style={{ height: containerHeight }}
        className="relative transition-[height] duration-300 ease-out"
      >
        <div
          ref={listRef}
          aria-hidden={viewMode !== "list"}
          className={[
            "absolute inset-0 overflow-hidden transition duration-200",
            viewMode === "list"
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-[0.98] pointer-events-none",
            "space-y-4",
          ].join(" ")}
        >
          {filtered.map((s) => {
            const row = (
              <div className="flex items-stretch gap-6 px-6 py-5 md:py-6">
                <div className="flex w-full md:w-[32%] items-center gap-4">
                  <div className="flex-shrink-0 size-16 rounded-xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    <div className="size-16 grid place-items-center text-sm font-medium text-slate-600">
                      {s.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-slate-900 dark:text-gray-100 font-semibold truncate">
                      {s.name}
                    </div>
                    <div className="mt-1 text-[13px] text-[#15358D]/90 truncate">
                      {s.industry_segment}
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex w-[36%] flex-col gap-2 text-sm text-slate-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#15358D]" />
                    <span className="truncate">{s.cnpj}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <span className="truncate">{s.founders.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings size={14} className="text-slate-400" />
                    <span className="truncate">{s.problems_solved.join(", ")}</span>
                  </div>
                </div>

                {role === "admin" && (
                  <div className="ml-auto self-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStartup(s);
                        openModal();
                      }}
                      aria-label={`Abrir menu de ${s.name}`}
                      className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 transition"
                    >
                      <MoreHorizontal className="text-slate-600 dark:text-gray-300" />
                    </button>
                  </div>
                )}
              </div>
            );

            return (
              <div
                key={`list-${s.id}`}
                className="group relative rounded-2xl border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition"
              >
                {wrapIfNeeded(s, row)}
              </div>
            );
          })}
        </div>

        <div
          ref={gridRef}
          aria-hidden={viewMode !== "grid"}
          className={[
            "absolute inset-0 overflow-auto transition duration-200",
            viewMode === "grid"
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-[0.98] pointer-events-none",
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pr-1",
          ].join(" ")}
        >
          {filtered.map((s) => {
            const card = (
              <article className="group relative overflow-hidden rounded-2xl border bg-white dark:bg-gray-900 shadow-sm transition border-[#E5E7EB] dark:border-gray-800 hover:border-[#15358D]/40 hover:ring-1 hover:ring-[#15358D]/20 hover:scale-[1.01]">
                <div className="h-1.5 w-full bg-gradient-to-r from-[#15358D]/85 via-[#15358D]/35 to-[#15358D]/10" />
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-xl bg-slate-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden ring-1 ring-[#15358D]/20">
                      <div className="size-12 grid place-items-center text-sm font-semibold text-slate-700">
                        {s.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-gray-100 truncate">
                        {s.name}
                      </h3>
                      <div className="mt-1 text-[12px] text-[#15358D] truncate">
                        {s.industry_segment}
                      </div>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#15358D]" />
                      <span className="truncate">{s.cnpj}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      <span className="truncate">{s.founders.join(", ")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Settings size={14} className="text-slate-400" />
                      <span className="truncate">{s.problems_solved.join(", ")}</span>
                    </li>
                  </ul>
                </div>
              </article>
            );

            return <div key={`grid-${s.id}`}>{wrapIfNeeded(s, card)}</div>;
          })}
        </div>
      </div>

      {role === "admin" && selectedStartup && (
        <StartupProfile
          isOpen={isOpen}
          onClose={() => {
            setSelectedStartup(null);
            closeModal();
          }}
          data={selectedStartup}
        />
      )}
    </div>
  );
}
