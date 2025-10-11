// src/components/startup/StartupCard.tsx
"use client";

import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutGrid,
  List as ListIcon,
  MoreHorizontal,
  Calendar,
  Mail,
  Settings,
} from "lucide-react";
import { Startup, StartupData } from "@/mocks/StartupData";
import { useModal } from "@/hooks/useModal";
import StartupProfile from "./StartupProfile";

type Role = "admin" | "gestor" | "avaliador" | "usuario";

type Props = {
  role?: Role;
  viewerCompanyId?: number;
  companyIdFilter?: string | number;
  title?: string;
  autoOpen?: boolean;
};

type StartupView = Startup;

export default function StartupCard({
  role = "admin",
  viewerCompanyId,
  companyIdFilter,
  title = "Startups",
  autoOpen = false,
}: Props) {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // dados
  const data: StartupView[] = useMemo(() => StartupData, []);
  const filtered = useMemo(() => {
    const byCompany =
      companyIdFilter !== undefined
        ? data.filter((s) => s.companyId === Number(companyIdFilter))
        : data;

    const canSeeAll = role === "admin" || role === "gestor";
    if (canSeeAll) return byCompany;

    if (viewerCompanyId == null) return [];
    return byCompany.filter((s) => s.companyId === Number(viewerCompanyId));
  }, [data, role, viewerCompanyId, companyIdFilter]);

  // --- Transição suave: animar altura do contêiner entre views ---
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
    // mede após o paint
    requestAnimationFrame(recalcHeight);
  }, [viewMode, filtered, recalcHeight]);

  useEffect(() => {
    const onResize = () => recalcHeight();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [recalcHeight]);

  useEffect(() => {
    if (!autoOpen) return;
    if (filtered[0]) setSelectedStartup(filtered[0]);
  }, [autoOpen, filtered]);

  if (!filtered.length) {
    return (
      <div className="w-full p-6 text-sm text-gray-500 dark:text-[#ced3db]">
        Nenhuma startup encontrada
        {role === "admin" || role === "gestor" ? "" : " para sua empresa"}.
      </div>
    );
  }

  // Admin abre modal; outros papéis navegam para a página da startup.
  const wrapIfNeeded = (
    startup: Startup,
    children: React.ReactNode,
    asCard?: boolean
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
      return (
        <div {...handlers} className={asCard ? "" : ""}>
          {children}
        </div>
      );
    }
    return (
      <Link
        href={`/startup/${startup.id}?role=${role}`}
        className="block"
        prefetch={false}
      >
        {children}
      </Link>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4">
      {/* Cabeçalho + Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-semibold text-slate-900 dark:text-gray-100">
          {title}
        </h2>

        <button
          type="button"
          onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
          className="inline-flex items-center justify-center rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800 p-2 transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#15358D] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
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

      {/* Contêiner com altura animada para transição suave */}
      <div
        ref={containerRef}
        style={{ height: containerHeight }}
        className="relative transition-[height] duration-300 ease-out"
      >
        {/* LISTA — mesmo layout da lista de empresas */}
        <div
          ref={listRef}
          aria-hidden={viewMode !== "list"}
          className={[
            "absolute inset-0 overflow-hidden will-change-transform",
            "transition duration-200",
            viewMode === "list"
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-[0.98] pointer-events-none",
            "space-y-4",
          ].join(" ")}
        >
          {filtered.map((s) => {
            const row = (
              <div className="flex items-stretch gap-6 px-6 py-5 md:py-6">
                {/* Coluna 1 — Logo, Nome, Área (≈32%) */}
                <div className="flex w-full md:w-[32%] items-center gap-4">
                  <div className="flex-shrink-0 size-16 rounded-xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    {s.logo ? (
                      <Image
                        src={s.logo}
                        alt={s.nome ?? "Logo da startup"}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    ) : (
                      <div className="size-16 grid place-items-center text-sm font-medium text-slate-600">
                        {s.nome?.[0]?.toUpperCase() ?? "?"}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-slate-900 dark:text-gray-100 font-semibold leading-tight truncate">
                      {s.nome}
                    </div>
                    <div className="mt-1 text-[13px] text-[#15358D]/90 truncate">
                      {s.areaAtuacao}
                    </div>
                  </div>
                </div>

                {/* Coluna 2 — CNPJ / Razão / Email / Setor (≈36%) */}
                <div className="hidden md:flex w-[36%] flex-col gap-2 text-sm text-slate-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#15358D]" />
                    <span className="truncate">{s.cnpj}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <span className="truncate">{s.razaoSocial}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400" />
                    <span className="truncate">{s.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings size={14} className="text-slate-400" />
                    <span className="truncate">{s.setor}</span>
                  </div>
                </div>

                {/* Coluna 3 — Descrição (≈28%) */}
                <div className="hidden lg:flex w-[28%] items-center text-sm text-slate-600 dark:text-gray-400">
                  <p className="line-clamp-3">{s.descricao}</p>
                </div>

                {/* Ações (somente admin) */}
                {role === "admin" && (
                  <div className="ml-auto self-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStartup(s);
                        openModal();
                      }}
                      aria-label={`Abrir menu de ${s.nome}`}
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

        {/* CARDS — elegantes, com gradiente no topo */}
        <div
          ref={gridRef}
          aria-hidden={viewMode !== "grid"}
          className={[
            "absolute inset-0 overflow-auto will-change-transform",
            "transition duration-200",
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
                    <div className="size-12 rounded-xl bg-slate-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden ring-1 ring-[#15358D]/20 ring-offset-2 ring-offset-white dark:ring-offset-gray-900">
                      {s.logo ? (
                        <Image
                          src={s.logo}
                          alt={s.nome ?? "Logo da startup"}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      ) : (
                        <div className="size-12 grid place-items-center text-sm font-semibold text-slate-700">
                          {s.nome?.[0]?.toUpperCase() ?? "?"}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-gray-100 truncate">
                        {s.nome}
                      </h3>
                      <div className="mt-1 text-[12px] text-[#15358D] truncate">
                        {s.areaAtuacao}
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
                      <span className="truncate">{s.razaoSocial}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-400" />
                      <span className="truncate">{s.email}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Settings size={14} className="text-slate-400" />
                      <span className="truncate">{s.setor}</span>
                    </li>
                  </ul>

                  <p className="mt-3 text-sm text-slate-600 dark:text-gray-400 line-clamp-3">
                    {s.descricao}
                  </p>
                </div>
              </article>
            );

            return <div key={`grid-${s.id}`}>{wrapIfNeeded(s, card, true)}</div>;
          })}
        </div>
      </div>

      {/* Modal (apenas admin) */}
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
