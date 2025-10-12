// src/components/companies/CompanieCard.tsx
"use client";

import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { LayoutGrid, List as ListIcon, Settings, User, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { companiesData, type Companie } from "@/mocks/CompaniesData";
import CompaniesProfileInline from "./CompaniesProfileInline";

type Role = "admin" | "gestor" | "avaliador" | "usuario";

type Props = {
  role?: Role;
  companyId?: string;
  autoOpen?: boolean;
  viewerCompanyId?: number;
};

export default function CompanieCard({
  role = "usuario",
  companyId,
  autoOpen = false,
  viewerCompanyId,
}: Props) {
  const list = useMemo(() => {
    const base = companiesData as Companie[];
    if (!companyId) return base;
    const idNum = Number(companyId);
    if (Number.isFinite(idNum)) return base.filter((c) => c.id === idNum);
    return base.filter((c) => String(c.id) === String(companyId));
  }, [companyId]);

  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const listRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number | undefined>(undefined);

  const recalcHeight = useCallback(() => {
    const activeEl = viewMode === "list" ? listRef.current : gridRef.current;
    if (!activeEl) return;
    setContainerHeight(activeEl.scrollHeight);
  }, [viewMode]);

  useEffect(() => {
    requestAnimationFrame(recalcHeight);
  }, [viewMode, list, recalcHeight]);

  useEffect(() => {
    const onResize = () => recalcHeight();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [recalcHeight]);

  if (autoOpen) {
    if (!list.length) {
      return <div className="w-full p-6 text-sm text-gray-500">Empresa não encontrada.</div>;
    }
    const canEdit =
      role === "admin" ||
      (role === "gestor" && String(viewerCompanyId) === String(list[0].id));
    return <CompaniesProfileInline data={list[0]} editable={canEdit} />;
  }

  if (!list.length) {
    return <div className="w-full p-6 text-sm text-gray-500">Nenhuma empresa encontrada.</div>;
  }

  // 🧭 redirecionamentos
  const hrefFor = (c: Companie): string => {
    const q = `?role=${role}`;
    switch (role) {
      case "admin":
        return `/company/${c.id}/empresa${q}`; // admin agora vai pra EMPRESA
      case "gestor":
      case "usuario":
        return `/company/${c.id}/empresa${q}`;
      case "avaliador":
        return `/company/${c.id}/desafios${q}`;
      default:
        return `/company/${c.id}/empresa${q}`;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4">
      {/* Cabeçalho + Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-semibold text-slate-900 dark:text-gray-100">Empresas</h2>
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

      {/* Conteúdo */}
      <div style={{ height: containerHeight ?? "auto" }} className="relative transition-[height] duration-300 ease-out">
        {/* LISTA */}
        <div
          ref={listRef}
          aria-hidden={viewMode !== "list"}
          className={`absolute inset-0 transition duration-200 ${viewMode === "list" ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-[0.98] pointer-events-none"} space-y-4`}
        >
          {list.map((c) => (
            <Link
              key={`list-${c.id}`}
              href={hrefFor(c)}
              className="group relative block rounded-2xl border border-[#E5E7EB] dark:border-gray-800 bg-[#F9FAFB] dark:bg-gray-900 shadow-sm hover:shadow-md transition"
              prefetch={false}
            >
              <div className="flex items-stretch gap-6 px-6 py-5 md:py-6">
                {/* Coluna 1 */}
                <div className="flex w-full md:w-[32%] items-center gap-4">
                  <div className="w-16 h-16 bg-[#E5E7EB] dark:bg-gray-700 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {c.logo ? (
                      <Image
                        src={c.logo}
                        alt={`${c.nome} logo`}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-16 h-16 grid place-items-center text-sm font-medium">
                        {c.nome?.[0]?.toUpperCase() ?? "?"}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#15358D] dark:text-blue-500 truncate">{c.nome}</h3>
                    <p className="text-sm text-[#98A2B3] truncate">{c.areaAtuacao}</p>
                  </div>
                </div>

                {/* Coluna 2 */}
                <div className="hidden md:flex w-[36%] flex-col gap-2 text-sm text-[#344054] dark:text-[#ced3db]">
                  <div className="flex w-full items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#15358D]" />
                    <span className="truncate">{c.cnpj}</span>
                  </div>
                  <div className="flex w-full items-center gap-2">
                    <User size={15} className="text-[#98A2B3]" />
                    <span className="truncate">{c.gestor}</span>
                  </div>
                  <div className="flex w-full items-center gap-2">
                    <Mail size={15} className="text-[#98A2B3]" />
                    <span className="truncate">{c.email}</span>
                  </div>
                  <div className="flex w-full items-center gap-2">
                    <Settings size={15} className="text-[#98A2B3]" />
                    <span className="truncate">{c.setor}</span>
                  </div>
                </div>

                {/* Coluna 3 */}
                <div className="hidden lg:flex w-[28%] items-center text-sm text-[#344054] dark:text-[#ced3db]">
                  <p className="line-clamp-3">{c.descricao}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* GRID */}
        <div
          ref={gridRef}
          aria-hidden={viewMode !== "grid"}
          className={`absolute inset-0 overflow-auto transition duration-200 ${viewMode === "grid" ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-[0.98] pointer-events-none"} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pr-1`}
        >
          {list.map((c) => (
            <Link key={`grid-${c.id}`} href={hrefFor(c)} className="block" prefetch={false}>
              <article className="group relative overflow-hidden rounded-2xl border bg-white dark:bg-gray-900 shadow-sm transition border-[#E5E7EB] dark:border-gray-800 hover:border-[#15358D]/40 hover:ring-1 hover:ring-[#15358D]/20 hover:scale-[1.01]">
                <div className="h-1.5 w-full bg-gradient-to-r from-[#15358D]/85 via-[#15358D]/35 to-[#15358D]/10" />
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-xl bg-slate-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden ring-1 ring-[#15358D]/20 ring-offset-2 ring-offset-white dark:ring-offset-gray-900">
                      {c.logo ? (
                        <Image
                          src={c.logo}
                          alt={c.nome ?? "Logo da empresa"}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      ) : (
                        <div className="size-12 grid place-items-center text-sm font-semibold text-slate-700">
                          {c.nome?.[0]?.toUpperCase() ?? "?"}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-gray-100 truncate">
                        {c.nome}
                      </h3>
                      <div className="mt-1 text-[12px] text-[#15358D] truncate">
                        {c.areaAtuacao}
                      </div>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#15358D]" />
                      <span className="truncate">{c.cnpj}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <User size={14} className="text-slate-400" />
                      <span className="truncate">{c.gestor}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-400" />
                      <span className="truncate">{c.email}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Settings size={14} className="text-slate-400" />
                      <span className="truncate">{c.setor}</span>
                    </li>
                  </ul>

                  <p className="mt-3 text-sm text-slate-600 dark:text-gray-400 line-clamp-3">
                    {c.descricao}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
