"use client";

import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { userService } from "@/api/services/user.service";
import type { ShowAllUsersItem } from "@/api/payloads/user.payload";
import { AxiosError } from "axios";
import { LayoutGrid, List as ListIcon, Mail, Building2, ShieldCheck, RotateCw } from "lucide-react";

const PAGE_SIZE = 10;

const ROLE_LABEL: Record<NonNullable<ShowAllUsersItem["role"]>, string> = {
  COMMON: "Colaborador",
  ADMINISTRATOR: "Administrador",
  EVALUATOR: "Avaliador",
  MANAGER: "Gestor",
};

const getRoleValue = (u: ShowAllUsersItem) => u.role ?? u.type_user ?? null;
const isActive = (u: ShowAllUsersItem) => (u.isActive ?? u.active ?? true);
const shortId = (id?: string | null) => (id ? id.slice(0, 8) + "…" : "—");
const initials = (name?: string | null) =>
  (name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() || "")
    .join("") || "?";

export default function UsersClient() {
  const [data, setData] = useState<ShowAllUsersItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // refs para animar altura
  const listRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const recalcHeight = useCallback(() => {
    const activeEl = (viewMode === "list" ? listRef.current : gridRef.current) as HTMLDivElement | null;
    if (!activeEl) return;
    setContainerHeight(activeEl.scrollHeight);
  }, [viewMode]);

  async function fetchUsers() {
    try {
      setLoading(true);
      setErr(null);
      const res = await userService.showAllUsers();
      setData(res ?? []);
    } catch (e) {
      const ax = e as AxiosError;
      setErr(ax.message || "Falha ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  // sem busca local aqui — quem cuida é a topbar global
  const filtered = useMemo(() => data, [data]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageSlice = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  useEffect(() => {
    const frame = requestAnimationFrame(recalcHeight);
    return () => cancelAnimationFrame(frame);
  }, [viewMode, pageSlice, recalcHeight]);

  useEffect(() => {
    const onResize = () => recalcHeight();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [recalcHeight]);

  if (loading) {
    return (
      <div className="w-full p-6 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-[#15358D]/30 border-t-[#15358D] rounded-full animate-spin" />
      </div>
    );
  }

  if (err) {
    return (
      <div className="w-full rounded-2xl border p-5 text-sm">
        <p className="text-red-600 font-medium mb-2">Erro ao carregar usuários.</p>
        <p className="text-gray-700 mb-3">{err}</p>
        <button
          onClick={fetchUsers}
          className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!filtered.length) {
    return (
      <div className="w-full p-6 text-sm text-gray-500">
        Nenhum usuário encontrado.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full p-4">
      {/* Header interno: título à esquerda; ações (toggle + refresh) à direita */}
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-semibold text-slate-900">Usuários</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
            className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-slate-50 p-2 transition-all"
            aria-label="Alternar visualização"
            title={viewMode === "list" ? "Ver em cards" : "Ver em lista"}
          >
            {viewMode === "list" ? (
              <LayoutGrid size={18} className="text-gray-700" />
            ) : (
              <ListIcon size={18} className="text-gray-700" />
            )}
          </button>
          <button
            type="button"
            onClick={fetchUsers}
            className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-slate-50 p-2 transition-all"
            aria-label="Atualizar lista"
            title="Atualizar"
          >
            <RotateCw size={18} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Área com animação de altura */}
      <div style={{ height: containerHeight }} className="relative transition-[height] duration-300 ease-out">
        {/* LIST VIEW */}
        <div
          ref={listRef}
          aria-hidden={viewMode !== "list"}
          className={`absolute inset-0 overflow-hidden will-change-transform transition duration-200 space-y-4 ${
            viewMode === "list" ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-[0.98] pointer-events-none"
          }`}
        >
          {pageSlice.map((u) => (
            <div
              key={`list-${u.id}`}
              className="group relative rounded-2xl border border-[#E5E7EB] bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-stretch gap-6 px-6 py-5 md:py-6">
                {/* Avatar + Nome */}
                <div className="flex w-full md:w-[32%] items-center gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
                    <span className="text-base font-semibold text-slate-700">
                      {initials(u.name)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-slate-900 font-semibold leading-tight truncate">{u.name || "—"}</div>
                    <div className="mt-1 text-[13px] text-[#15358D]/90 truncate">
                      {getRoleValue(u) ? ROLE_LABEL[getRoleValue(u)!] : "—"}
                    </div>
                  </div>
                </div>

                {/* Info (email, empresa, status) */}
                <div className="hidden md:flex w-[36%] flex-col gap-2 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400" />
                    <span className="truncate">{u.email || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-slate-400" />
                    <span className="truncate">{shortId(u.enterpriseId)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-slate-400" />
                    {isActive(u) ? (
                      <span className="rounded-full bg-green-50 text-green-700 px-2 py-0.5 text-xs">Ativo</span>
                    ) : (
                      <span className="rounded-full bg-red-50 text-red-700 px-2 py-0.5 text-xs">Inativo</span>
                    )}
                  </div>
                </div>

                <div className="hidden lg:flex w-[28%] items-center text-sm text-slate-600">
                  <p>{u.createdAt ? new Date(u.createdAt).toLocaleDateString("pt-BR") : "—"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* GRID VIEW */}
        <div
          ref={gridRef}
          aria-hidden={viewMode !== "grid"}
          className={`absolute inset-0 overflow-auto will-change-transform transition duration-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pr-1 ${
            viewMode === "grid" ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-[0.98] pointer-events-none"
          }`}
        >
          {pageSlice.map((u) => (
            <article
              key={`grid-${u.id}`}
              className="group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition border-[#E5E7EB] hover:border-[#15358D]/40 hover:ring-1 hover:ring-[#15358D]/20 hover:scale-[1.01]"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-[#15358D]/85 via-[#15358D]/35 to-[#15358D]/10" />
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden ring-1 ring-[#15358D]/20 ring-offset-2 ring-offset-white">
                    <span className="text-sm font-semibold text-slate-700">
                      {initials(u.name)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-slate-900 truncate">{u.name || "—"}</h3>
                    <div className="mt-1 text-[12px] text-[#15358D] truncate">
                      {getRoleValue(u) ? ROLE_LABEL[getRoleValue(u)!] : "—"}
                    </div>
                  </div>
                </div>

                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400" />
                    <span className="truncate">{u.email || "—"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Building2 size={14} className="text-slate-400" />
                    <span className="truncate">{shortId(u.enterpriseId)}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-slate-400" />
                    {isActive(u) ? (
                      <span className="rounded-full bg-green-50 text-green-700 px-2 py-0.5 text-xs">Ativo</span>
                    ) : (
                      <span className="rounded-full bg-red-50 text-red-700 px-2 py-0.5 text-xs">Inativo</span>
                    )}
                  </li>
                </ul>

                <p className="mt-3 text-sm text-slate-600">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString("pt-BR") : "—"}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">
          Página {currentPage} de {totalPages} • {filtered.length} usuário(s)
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-xl border px-3 py-1.5 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-xl border px-3 py-1.5 disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}
