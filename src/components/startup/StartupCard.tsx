/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
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
        <h2 className="text-xl font-semibold">{title}</h2>

        <button
          onClick={() =>
            setViewMode(viewMode === "list" ? "grid" : "list")
          }
          className="p-2 border rounded-md"
        >
          {viewMode === "list" ? (
            <LayoutGrid size={18} />
          ) : (
            <ListIcon size={18} />
          )}
        </button>
      </div>

      <div
        style={{ height: containerHeight }}
        className="relative transition-[height] duration-300"
      >
        <div
          ref={listRef}
          className={`space-y-4 ${
            viewMode === "list" ? "block" : "hidden"
          }`}
        >
          {filtered.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border p-4 hover:shadow transition"
            >
              {wrapIfNeeded(
                s,
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{s.name}</p>
                    <p className="text-sm text-gray-500">
                      {s.industry_segment}
                    </p>
                  </div>

                  {canOpenModal && (
                    <MoreHorizontal className="text-gray-400" />
                  )}
                </div>
              )}
            </div>
          ))}
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