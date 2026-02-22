"use client";

import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { LayoutGrid, List as ListIcon, MoreHorizontal, User, Mail, Settings } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import CompaniesProfile from "./CompaniesProfile";
import { ShowAllEnterpriseResponse, ShowOneEnterpriseResponse } from "@/api/payloads/enterprise.payload";
import { enterpriseService } from "@/api/services/enterprise.service";
import { useStore } from "../../../store";
import type { Role } from "@/lib/roles";

type Props = {
  role?: Role;
  companyId?: string | number;
  autoOpen?: boolean;
  viewerCompanyId?: string | number;
  title?: string;
};

export default function CompanieCard({
  role,
  companyId,
  autoOpen = false,
  viewerCompanyId,
  title = "Empresas",
}: Props) {
  const { isOpen, openModal, closeModal } = useModal();
  const [companies, setCompaniesData] = useState<ShowAllEnterpriseResponse[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<ShowOneEnterpriseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const { reload } = useStore();
  const data = useMemo(() => companies, [companies]);
  const isAdmin = role === "ADMINISTRATOR";

  function companyKey(c: any): string | undefined {
    const cand = c?.id ?? c?.enterpriseId ?? c?.companyId ?? c?.uuid ?? c?.empresaId ?? c?.enterprise_id ?? c?.company_id;
    return cand == null ? undefined : String(cand);
  }

  const filtered = useMemo(() => {
    const toStr = (v: unknown) => (v == null ? undefined : String(v).trim());
    const paramId = toStr(companyId);
    const viewerId = toStr(viewerCompanyId);
    const byParam = paramId ? data.filter((c) => companyKey(c) === paramId) : data;
    if (isAdmin) return byParam;
    if (!viewerId) return [];
    const source = paramId ? byParam : data;
    return source.filter((c) => companyKey(c) === viewerId);
  }, [data, companyId, isAdmin, viewerCompanyId]);

  const listRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const recalcHeight = useCallback(() => {
    const activeEl = (viewMode === "list" ? listRef.current : gridRef.current) as HTMLDivElement | null;
    if (!activeEl) return;
    setContainerHeight(activeEl.scrollHeight);
  }, [viewMode]);

  async function fetchCompanies() {
    let cancelled = false;
    try {
      setLoading(true);
      let list: ShowAllEnterpriseResponse[] = [];
      if (isAdmin) {
        list = await enterpriseService.showAllEnterprises();
      } else if (viewerCompanyId) {
        const one = await enterpriseService.showOneEnterprise(String(viewerCompanyId));
        list = one ? [one] : [];
      }
      if (!cancelled) setCompaniesData(list);
    } catch (error) {
      console.error(error);
      if (!cancelled) setCompaniesData([]);
    } finally {
      if (!cancelled) setLoading(false);
    }
    return () => { cancelled = true; };
  }

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => { cleanup = await fetchCompanies(); })();
    return () => { cleanup?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, role, viewerCompanyId]);

  useEffect(() => {
    if (isAdmin || filtered.length !== 1) return;
    (async () => {
      try {
        const full = await enterpriseService.showOneEnterprise(String(filtered[0].id));
        setSelectedCompany(full);
        if (!isOpen) openModal();
      } catch (e) { console.error(e); }
    })();
  }, [isAdmin, filtered, isOpen, openModal]);

  useEffect(() => {
    const frame = requestAnimationFrame(recalcHeight);
    return () => cancelAnimationFrame(frame);
  }, [viewMode, filtered, recalcHeight]);

  useEffect(() => {
    window.addEventListener("resize", recalcHeight);
    return () => window.removeEventListener("resize", recalcHeight);
  }, [recalcHeight]);

  useEffect(() => {
    if (!autoOpen || !filtered[0] || isAdmin) return;
    (async () => {
      try {
        const full = await enterpriseService.showOneEnterprise(String(filtered[0].id));
        setSelectedCompany(full);
        openModal();
      } catch (e) { console.error(e); }
    })();
  }, [autoOpen, filtered, isAdmin, openModal]);

  if (loading) {
    return (
      <div className="w-full p-6 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-[#15358D]/30 border-t-[#15358D] rounded-full animate-spin" />
      </div>
    );
  }

  if (!filtered.length) {
    return (
      <div className="w-full p-6 text-sm text-gray-500 dark:text-[#ced3db]">
        Nenhuma empresa encontrada{isAdmin ? "" : " para sua empresa"}.
      </div>
    );
  }

  const wrapIfNeeded = (company: ShowAllEnterpriseResponse, children: React.ReactNode) => {
    if (isAdmin) {
      return (
        <div
          role="button"
          tabIndex={0}
          onClick={async () => {
            try {
              const full = await enterpriseService.showOneEnterprise(String(company.id));
              setSelectedCompany(full); openModal();
            } catch (e) { console.error(e); }
          }}
          onKeyDown={async (e) => {
            if (e.key === "Enter" || e.key === " ") {
              try {
                const full = await enterpriseService.showOneEnterprise(String(company.id));
                setSelectedCompany(full); openModal();
              } catch (e) { console.error(e); }
            }
          }}
        >{children}</div>
      );
    }
    const sameCompany = (companyId != null && String(companyId) === companyKey(company)) || filtered.length === 1;
    if (sameCompany) return <>{children}</>;
    return <Link href={`/company/${company.id}/empresa`} className="block" prefetch={false}>{children}</Link>;
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-semibold text-slate-900 dark:text-gray-100">{title}</h2>
        <button
          type="button"
          onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
          className="inline-flex items-center justify-center rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800 p-2 transition-all"
          aria-label="Alternar visualização"
        >
          {viewMode === "list" ? <LayoutGrid size={18} className="text-gray-700 dark:text-gray-300" /> : <ListIcon size={18} className="text-gray-700 dark:text-gray-300" />}
        </button>
      </div>

      <div style={{ height: containerHeight }} className="relative transition-[height] duration-300 ease-out">
        <div ref={listRef} aria-hidden={viewMode !== "list"} className={`absolute inset-0 overflow-hidden transition duration-200 space-y-4 ${viewMode === "list" ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-[0.98] pointer-events-none"}`}>
          {filtered.map((c) => {
            const logoSrc = c.profileImage?.url ?? c.logo ?? null;
            const row = (
              <div className="flex items-stretch gap-6 px-6 py-5 md:py-6">
                <div className="flex w-full md:w-[32%] items-center gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    {logoSrc ? <Image src={logoSrc} alt={c.name ?? "Logo"} width={64} height={64} unoptimized className="object-contain" /> : <div className="w-16 h-16 grid place-items-center text-sm font-medium">{c.name?.[0]?.toUpperCase() ?? "?"}</div>}
                  </div>
                  <div className="min-w-0">
                    <div className="text-slate-900 dark:text-gray-100 font-semibold leading-tight truncate">{c.name}</div>
                    <div className="mt-1 text-[13px] text-[#15358D]/90 truncate">{c.sector}</div>
                  </div>
                </div>
                <div className="hidden md:flex w-[36%] flex-col gap-2 text-sm text-slate-700 dark:text-gray-300">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#15358D]" /><span className="truncate">{c.cnpj}</span></div>
                  <div className="flex items-center gap-2"><User size={14} className="text-slate-400" /><span className="truncate">{c.gestorEmail}</span></div>
                  <div className="flex items-center gap-2"><Mail size={14} className="text-slate-400" /><span className="truncate">{c.email}</span></div>
                  <div className="flex items-center gap-2"><Settings size={14} className="text-slate-400" /><span className="truncate">{c.sector}</span></div>
                </div>
                <div className="hidden lg:flex w-[28%] items-center text-sm text-slate-600 dark:text-gray-400"><p className="line-clamp-3">{c.description}</p></div>
                {isAdmin && (
                  <div className="ml-auto self-center" onClick={(e) => e.stopPropagation()}>
                    <button type="button" onClick={async () => { try { const full = await enterpriseService.showOneEnterprise(String(c.id)); setSelectedCompany(full); openModal(); } catch (err) { console.error(err); } }} aria-label={`Abrir menu de ${c.name}`} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 transition">
                      <MoreHorizontal className="text-slate-600 dark:text-gray-300" />
                    </button>
                  </div>
                )}
              </div>
            );
            return (
              <div key={`list-${c.id}`} className="group relative rounded-2xl border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition">
                {wrapIfNeeded(c, row)}
              </div>
            );
          })}
        </div>

        <div ref={gridRef} aria-hidden={viewMode !== "grid"} className={`absolute inset-0 overflow-auto transition duration-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pr-1 ${viewMode === "grid" ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-[0.98] pointer-events-none"}`}>
          {filtered.map((c) => {
            const logoSrc = c.profileImage?.url ?? c.logo ?? null;
            const card = (
              <article className="group relative overflow-hidden rounded-2xl border bg-white dark:bg-gray-900 shadow-sm transition border-[#E5E7EB] dark:border-gray-800 hover:border-[#15358D]/40 hover:ring-1 hover:ring-[#15358D]/20 hover:scale-[1.01]">
                <div className="h-1.5 w-full bg-gradient-to-r from-[#15358D]/85 via-[#15358D]/35 to-[#15358D]/10" />
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-xl bg-slate-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden ring-1 ring-[#15358D]/20">
                      {logoSrc ? <Image src={logoSrc} alt={c.name ?? "Logo"} width={48} height={48} unoptimized className="object-contain" /> : <div className="size-12 grid place-items-center text-sm font-semibold text-slate-700">{c.name?.[0]?.toUpperCase() ?? "?"}</div>}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-gray-100 truncate">{c.name}</h3>
                      <div className="mt-1 text-[12px] text-[#15358D] truncate">{c.sector}</div>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-gray-300">
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#15358D]" /><span className="truncate">{c.cnpj}</span></li>
                    <li className="flex items-center gap-2"><User size={14} className="text-slate-400" /><span className="truncate">{c.gestorEmail}</span></li>
                    <li className="flex items-center gap-2"><Mail size={14} className="text-slate-400" /><span className="truncate">{c.email}</span></li>
                    <li className="flex items-center gap-2"><Settings size={14} className="text-slate-400" /><span className="truncate">{c.sector}</span></li>
                  </ul>
                  <p className="mt-3 text-sm text-slate-600 dark:text-gray-400 line-clamp-3">{c.description}</p>
                </div>
              </article>
            );
            return <div key={`grid-${c.id}`}>{wrapIfNeeded(c, card)}</div>;
          })}
        </div>
      </div>

      {selectedCompany && (
        <CompaniesProfile data={selectedCompany} isOpen={isOpen} onClose={() => { setSelectedCompany(null); closeModal(); }} />
      )}
    </div>
  );
}