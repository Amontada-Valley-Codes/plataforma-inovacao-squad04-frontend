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

type Role = "admin" | "gestor" | "avaliador" | "usuario";

type Props = {
  role?: Role;
  companyId?: string | number;       // empresa “focada” pela UI
  autoOpen?: boolean;                // se true, abre o modal quando tiver exatamente 1 resultado
  viewerCompanyId?: string | number; // empresa vinculada ao usuário logado
  title?: string;
};

export default function CompanieCard({
  role = "usuario",
  companyId,
  autoOpen = false,
  viewerCompanyId,
  title = "Empresas",
}: Props) {
  const { isOpen, openModal, closeModal } = useModal();

  // 🔹 Lista SEMPRE no shape de "listagem"
  const [companies, setCompaniesData] = useState<ShowAllEnterpriseResponse[]>([]);
  // 🔹 Selecionada SEMPRE no shape de "detalhe"
  const [selectedCompany, setSelectedCompany] = useState<ShowOneEnterpriseResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const { reload } = useStore();

  const data = useMemo(() => companies, [companies]);

  function companyKey(c: any): string | undefined {
    const cand =
      c?.id ??
      c?.enterpriseId ??
      c?.companyId ??
      c?.uuid ??
      c?.empresaId ??
      c?.enterprise_id ??
      c?.company_id;
    return cand == null ? undefined : String(cand);
  }

  const filtered = useMemo(() => {
    const toStr = (v: unknown) => (v == null ? undefined : String(v).trim());

    const paramId = toStr(companyId);
    const viewerId = toStr(viewerCompanyId);
    const isAdmin = role === "admin";

    const byParam = paramId ? data.filter((c) => companyKey(c) === paramId) : data;

    if (isAdmin) return byParam;

    if (!viewerId) return [];

    const source = paramId ? byParam : data;
    return source.filter((c) => companyKey(c) === viewerId);
  }, [data, companyId, role, viewerCompanyId]);

  // ——— Altura animada
  const listRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number | undefined>(undefined);

  const recalcHeight = useCallback(() => {
    const activeEl = (viewMode === "list" ? listRef.current : gridRef.current) as HTMLDivElement | null;
    if (!activeEl) return;
    setContainerHeight(activeEl.scrollHeight);
  }, [viewMode]);

  async function fetchCompanies() {
    try {
      setLoading(true);
      let list: ShowAllEnterpriseResponse[] = [];

      if (role === "admin") {
        // Admin lista todas
        list = await enterpriseService.showAllEnterprises();
      } else if (viewerCompanyId) {
        // Não-admin: busca o detalhe da própria empresa e projeta para “lista”
        const one = await enterpriseService.showOneEnterprise(String(viewerCompanyId));
        list = one
          ? [{
              id: one.id,
              name: one.name,
              cnpj: one.cnpj,
              sector: one.sector,
              description: one.description,
              address: one.address,
              email: one.email,
              gestorEmail: one.gestorEmail,
              coverImage: null,
              profileImage: null,
              status: one.status,
              createdAt: one.createdAt,
              updatedAt: one.updatedAt,
              logo: one.logo,
              cover: one.cover,
              gallery: one.gallery,
              instagram: one.instagram,
              whatsapp: one.whatsapp,
              linkedin: one.linkedin,
              locationUrl: one.locationUrl,
            }]
          : [];
      } else {
        list = [];
      }

      setCompaniesData(list);
    } catch (error) {
      console.error(error);
      setCompaniesData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, role, viewerCompanyId]);

  // NEW: não-admin com exatamente 1 empresa → abre modal com DETALHE
  useEffect(() => {
    if (role === "admin" || filtered.length !== 1) return;
    (async () => {
      try {
        const full = await enterpriseService.showOneEnterprise(String(filtered[0].id));
        setSelectedCompany(full);
        if (!isOpen) openModal();
      } catch (e) {
        console.error("Falha ao carregar detalhe:", e);
      }
    })();
  }, [role, filtered, isOpen, openModal]);

  useEffect(() => {
    const frame = requestAnimationFrame(recalcHeight);
    return () => cancelAnimationFrame(frame);
  }, [viewMode, filtered, recalcHeight]);

  useEffect(() => {
    const onResize = () => recalcHeight();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [recalcHeight]);

  useEffect(() => {
    if (!autoOpen) return;
    if (filtered[0] && role !== "admin") {
      // se quiser autoOpen para não-admin mesmo com >1, abrir o primeiro
      (async () => {
        try {
          const full = await enterpriseService.showOneEnterprise(String(filtered[0].id));
          setSelectedCompany(full);
          openModal();
        } catch (e) {
          console.error("Falha ao carregar detalhe:", e);
        }
      })();
    }
  }, [autoOpen, filtered, role, openModal]);

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
        Nenhuma empresa encontrada{role === "admin" ? "" : " para sua empresa"}.
      </div>
    );
  }

  // Wrapper: admin abre modal (carrega DETALHE); não-admin navega (ou só renderiza se já for a mesma)
  const wrapIfNeeded = (company: ShowAllEnterpriseResponse, children: React.ReactNode) => {
    if (role === "admin") {
      const handlers = {
        onClick: async () => {
          try {
            const full = await enterpriseService.showOneEnterprise(String(company.id));
            setSelectedCompany(full);
            openModal();
          } catch (e) {
            console.error("Falha ao carregar detalhe da empresa:", e);
          }
        },
        onKeyDown: async (e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key === "Enter" || e.key === " ") {
            try {
              const full = await enterpriseService.showOneEnterprise(String(company.id));
              setSelectedCompany(full);
              openModal();
            } catch (err) {
              console.error("Falha ao carregar detalhe da empresa:", err);
            }
          }
        },
        role: "button" as const,
        tabIndex: 0,
      };
      return <div {...handlers}>{children}</div>;
    }

    const sameCompany =
      (companyId != null && String(companyId) === companyKey(company)) ||
      filtered.length === 1;

    if (sameCompany) return <>{children}</>;

    return (
      <Link href={`/company/${company.id}/empresa?role=${role}`} className="block" prefetch={false}>
        {children}
      </Link>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4">
      {/* Cabeçalho + Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-semibold text-slate-900 dark:text-gray-100">{title}</h2>
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

      {/* Contêiner com altura animada */}
      <div style={{ height: containerHeight }} className="relative transition-[height] duration-300 ease-out">
        {/* LISTA */}
        <div
          ref={listRef}
          aria-hidden={viewMode !== "list"}
          className={`absolute inset-0 overflow-hidden will-change-transform transition duration-200 space-y-4 ${
            viewMode === "list" ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-[0.98] pointer-events-none"
          }`}
        >
          {filtered.map((c) => {
            const row = (
              <div className="flex items-stretch gap-6 px-6 py-5 md:py-6">
                {/* Coluna 1 */}
                <div className="flex w-full md:w-[32%] items-center gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    {c.logo ? (
                      <Image src={c.logo} alt={c.name ?? "Logo da empresa"} width={64} height={64} unoptimized className="object-contain" />
                    ) : (
                      <div className="w-16 h-16 grid place-items-center text-sm font-medium">
                        {c.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-slate-900 dark:text-gray-100 font-semibold leading-tight truncate">{c.name}</div>
                    <div className="mt-1 text-[13px] text-[#15358D]/90 truncate">{c.sector}</div>
                  </div>
                </div>

                {/* Coluna 2 */}
                <div className="hidden md:flex w-[36%] flex-col gap-2 text-sm text-slate-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#15358D]" />
                    <span className="truncate">{c.cnpj}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-slate-400" />
                    <span className="truncate">{c.gestorEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400" />
                    <span className="truncate">{c.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings size={14} className="text-slate-400" />
                    <span className="truncate">{c.sector}</span>
                  </div>
                </div>

                {/* Coluna 3 */}
                <div className="hidden lg:flex w-[28%] items-center text-sm text-slate-600 dark:text-gray-400">
                  <p className="line-clamp-3">{c.description}</p>
                </div>

                {/* Ações admin */}
                {role === "admin" && (
                  <div className="ml-auto self-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const full = await enterpriseService.showOneEnterprise(String(c.id));
                          setSelectedCompany(full);
                          openModal();
                        } catch (err) {
                          console.error("Falha ao carregar detalhe da empresa:", err);
                        }
                      }}
                      aria-label={`Abrir menu de ${c.name}`}
                      className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 transition"
                    >
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

        {/* GRID */}
        <div
          ref={gridRef}
          aria-hidden={viewMode !== "grid"}
          className={`absolute inset-0 overflow-auto will-change-transform transition duration-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pr-1 ${
            viewMode === "grid" ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-[0.98] pointer-events-none"
          }`}
        >
          {filtered.map((c) => {
            const card = (
              <article className="group relative overflow-hidden rounded-2xl border bg-white dark:bg-gray-900 shadow-sm transition border-[#E5E7EB] dark:border-gray-800 hover:border-[#15358D]/40 hover:ring-1 hover:ring-[#15358D]/20 hover:scale-[1.01]">
                <div className="h-1.5 w-full bg-gradient-to-r from-[#15358D]/85 via-[#15358D]/35 to-[#15358D]/10" />
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-xl bg-slate-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden ring-1 ring-[#15358D]/20 ring-offset-2 ring-offset-white dark:ring-offset-gray-900">
                      {c.logo ? (
                        <Image src={c.logo} alt={c.name ?? "Logo da empresa"} width={48} height={48} unoptimized className="object-contain" />
                      ) : (
                        <div className="size-12 grid place-items-center text-sm font-semibold text-slate-700">
                          {c.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-gray-100 truncate">{c.name}</h3>
                      <div className="mt-1 text-[12px] text-[#15358D] truncate">{c.sector}</div>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#15358D]" />
                      <span className="truncate">{c.cnpj}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <User size={14} className="text-slate-400" />
                      <span className="truncate">{c.gestorEmail}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-400" />
                      <span className="truncate">{c.email}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Settings size={14} className="text-slate-400" />
                      <span className="truncate">{c.sector}</span>
                    </li>
                  </ul>

                  <p className="mt-3 text-sm text-slate-600 dark:text-gray-400 line-clamp-3">{c.description}</p>
                </div>
              </article>
            );

            return <div key={`grid-${c.id}`}>{wrapIfNeeded(c, card)}</div>;
          })}
        </div>
      </div>

      {/* Modal: sempre recebe DETALHE */}
      {selectedCompany && (
        <CompaniesProfile
          data={selectedCompany}
          isOpen={isOpen}
          onClose={() => {
            setSelectedCompany(null);
            closeModal();
          }}
        />
      )}
    </div>
  );
}
