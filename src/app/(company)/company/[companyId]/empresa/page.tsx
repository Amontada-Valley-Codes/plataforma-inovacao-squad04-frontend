"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CompaniesProfileInline from "@/components/companies/CompaniesProfileInline";
import { getCurrentUser, getUserRole } from "@/lib/auth";
import { enterpriseService } from "@/api/services/enterprise.service";
import type {
  ShowAllEnterpriseResponse,
  ShowOneEnterpriseResponse,
} from "@/api/payloads/enterprise.payload";

type Role = "admin" | "gestor" | "avaliador" | "usuario";
type Enterprise = ShowAllEnterpriseResponse | ShowOneEnterpriseResponse;

export default function CompanyEmpresaPage() {
  const { companyId } = useParams<{ companyId: string }>();

  const [viewerCompanyId, setViewerCompanyId] = useState<string | number | undefined>(undefined);
  const [role, setRole] = useState<Role>("usuario");
  const [readyAuth, setReadyAuth] = useState(false);

  const [enterprise, setEnterprise] = useState<Enterprise | null>(null);
  const [loadingEnterprise, setLoadingEnterprise] = useState(false);

  // carrega usuário/role
  useEffect(() => {
    (async () => {
      const [me, r] = await Promise.all([getCurrentUser(), getUserRole()]);
      setViewerCompanyId(me?.companyId);
      setRole(r as Role);
      setReadyAuth(true);
    })();
  }, []);

  // se não for admin, busca a empresa e mostra inline
  useEffect(() => {
    if (!readyAuth) return;
    if (role === "admin") return; // admin continua vendo a lista/card

    const idToFetch =
      companyId != null
        ? String(companyId)
        : viewerCompanyId != null
        ? String(viewerCompanyId)
        : undefined;

    if (!idToFetch) {
      setEnterprise(null);
      return;
    }

    let mounted = true;
    setLoadingEnterprise(true);
    enterpriseService
      .showOneEnterprise(idToFetch)
      .then((one) => {
        if (!mounted) return;
        setEnterprise(one);
      })
      .catch(() => {
        if (!mounted) return;
        setEnterprise(null);
      })
      .finally(() => {
        if (!mounted) return;
        setLoadingEnterprise(false);
      });

    return () => {
      mounted = false;
    };
  }, [readyAuth, role, companyId, viewerCompanyId]);

  // loading
  if (!readyAuth || (role !== "admin" && loadingEnterprise)) {
    return (
      <div className="w-full p-6 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-[#15358D]/30 border-t-[#15358D] rounded-full animate-spin" />
      </div>
    );
  }

  // não-admin com empresa encontrada => inline
  if (role !== "admin" && enterprise) {
    const editableInline = role === "gestor"; // só gestor edita
    return (
      <div className="w-full max-w-screen-xl mx-auto px-3 sm:px-4 md:px-6 py-4 overflow-x-hidden">
        <CompaniesProfileInline data={enterprise} editable={editableInline} />
      </div>
    );
  }
}
