/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutGrid,
  List as ListIcon, Settings,
  FileText
} from "lucide-react";
import { useModal } from "@/hooks/useModal";
import StartupProfile from "./StartupProfile";
import { startupService } from "@/api/services/startup.service";
import { ShowAllStartupsResponse } from "@/api/payloads/startup.payload";
import { useStore } from "../../../store";

import type { Role } from "@/lib/roles";
import { hasPermission } from "@/lib/roles";

type Props = {
  role?: Role | null;
  viewerCompanyId?: number;
  companyIdFilter?: string | number;
  title?: string;
  autoOpen?: boolean;
};

export default function StartupCard({
  role = null,
  viewerCompanyId,
  companyIdFilter,
  title = "Startups",
  autoOpen = false,
}: Props) {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedStartup, setSelectedStartup] =
    useState<ShowAllStartupsResponse | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [startups, setStartups] = useState<ShowAllStartupsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { reload } = useStore();

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
  }, [reload]);


  const canSeeAll =
    role &&
    hasPermission(role, ["ADMINISTRATOR", "MANAGER"]);

  const canOpenModal = role === "ADMINISTRATOR";
  const canNavigate = role === "MANAGER";

  // 🔎 Filtro baseado na role
  const filtered = useMemo(() => {
    if (canSeeAll) return startups;

    if (!viewerCompanyId) return [];

    return startups; // aqui você pode aplicar filtro por empresa se quiser
  }, [startups, canSeeAll, viewerCompanyId, companyIdFilter]);

  // --- Animação de altura ---
  const listRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] =
    useState<number | undefined>(undefined);

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
    if (autoOpen && filtered[0] && canOpenModal) {
      setSelectedStartup(filtered[0]);
      openModal();
    }
  }, [autoOpen, filtered, canOpenModal, openModal]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!filtered.length) {
    return (
      <div className="w-full p-6 text-sm text-gray-500">
        Nenhuma startup encontrada.
      </div>
    );
  }

  const wrapIfNeeded = (
    startup: ShowAllStartupsResponse,
    children: React.ReactNode
  ) => {
    if (canNavigate) {
      return (
        <div
          role="button"
          tabIndex={0}
          onClick={() => router.push(`/user/startups/${startup.id}`)}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") &&
            router.push(`/user/startups/${startup.id}`)
          }
        >
          {children}
        </div>
      );
    }

    if (canOpenModal) {
      return (
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            setSelectedStartup(startup);
            openModal();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setSelectedStartup(startup);
              openModal();
            }
          }}
        >
          {children}
        </div>
      );
    }

    return <>{children}</>;
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-semibold text-slate-900 dark:text-gray-100">{title}</h2>
        <button
          type="button"
          onClick={() =>
            setViewMode(viewMode === "list" ? "grid" : "list")
          }
          className="inline-flex items-center justify-center rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800 p-2 transition-all"
          aria-label="Alternar visualização"
        >
          {viewMode === "list" ? (
            <LayoutGrid size={18} className="text-gray-700 dark:text-gray-300" />
          ) : (
            <ListIcon size={18} className="text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>

      <div
        style={{ height: containerHeight }}
        className="relative transition-[height] duration-300 ease-out"
      >
        <div
          ref={listRef}
          aria-hidden={viewMode !== "list"}
          className={`absolute inset-0 transition duration-200 space-y-4 p-1 ${
            viewMode === "list" ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-[0.98] pointer-events-none"
          }`}
        >
          {filtered.map((s) => {
            const row = (
              <div className="flex items-stretch gap-6 px-6 py-5 md:py-6">
                <div className="flex w-full md:w-[32%] items-center gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-[#15409c]/10 dark:bg-[#15409c]/20 flex items-center justify-center overflow-hidden">
                    <div className="w-16 h-16 grid place-items-center text-sm font-medium text-[#15409c]">
                      {s.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-slate-900 dark:text-gray-100 font-semibold leading-tight truncate">
                      {s.name}
                    </div>
                    <div className="mt-1 text-[13px] text-[#15358D]/90 truncate">
                      {s.industry_segment}
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex w-[36%] flex-col gap-2 text-sm text-slate-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-[#15409c]" />
                    <span className="truncate">{s.cnpj || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings size={14} className="text-[#15409c]" />
                    <span className="truncate">{s.industry_segment}</span>
                  </div>
                </div>
              </div>
            );
            return (
              <div
                key={`list-${s.id}`}
                className="group relative rounded-2xl border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md hover:border-[#15409c] dark:hover:border-[#15409c] hover:scale-[1.01] transition cursor-pointer"
              >
                {wrapIfNeeded(s, row)}
              </div>
            );
          })}
        </div>

        <div
          ref={gridRef}
          aria-hidden={viewMode !== "grid"}
          className={`absolute inset-0 overflow-auto transition duration-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-1 ${
            viewMode === "grid" ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-[0.98] pointer-events-none"
          }`}
        >
          {filtered.map((s) => {
            const card = (
              <article className="group relative overflow-hidden rounded-2xl border bg-white dark:bg-gray-900 shadow-sm transition border-[#E5E7EB] dark:border-gray-800 hover:border-[#15358D]/40 hover:ring-1 hover:ring-[#15358D]/20 hover:scale-[1.01]">
                <div className="h-1.5 w-full bg-gradient-to-r from-[#15358D]/85 via-[#15358D]/35 to-[#15358D]/10" />
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-xl bg-[#15409c]/10 dark:bg-[#15409c]/20 flex items-center justify-center overflow-hidden ring-1 ring-[#15358D]/20">
                      <div className="size-12 grid place-items-center text-sm font-semibold text-[#15409c]">
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
                      <FileText size={14} className="text-[#15409c]" />
                      <span className="truncate">{s.cnpj || "N/A"}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Settings size={14} className="text-[#15409c]" />
                      <span className="truncate">{s.industry_segment}</span>
                    </li>
                  </ul>
                </div>
              </article>
            );
            return <div key={`grid-${s.id}`}>{wrapIfNeeded(s, card)}</div>;
          })}
        </div>
      </div>

      {canOpenModal && selectedStartup && (
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